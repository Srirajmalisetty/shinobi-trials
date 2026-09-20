package com.app.quizsystem.grading;

import com.app.quizsystem.model.AiGradingLog;
import com.app.quizsystem.model.Question;
import com.app.quizsystem.repository.AiGradingLogRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;

@Component
public class AiGradingClient {

    private static final Logger log = LoggerFactory.getLogger(AiGradingClient.class);

    private final AiGradingLogRepository aiGradingLogRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ai.grading.api-key:}")
    private String apiKey;

    @Value("${ai.grading.model:gemini-1.5-flash}")
    private String modelName;

    @Value("${ai.grading.timeout-ms:8000}")
    private int timeoutMs;

    public AiGradingClient(AiGradingLogRepository aiGradingLogRepository) {
        this.aiGradingLogRepository = aiGradingLogRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public GradingResult evaluate(Question question, String studentAnswer, Long submissionAnswerId) {
        long startTime = System.currentTimeMillis();
        int maxPoints = question.getPoints() != null ? question.getPoints() : 10;

        if (studentAnswer == null || studentAnswer.trim().isEmpty()) {
            logAudit(submissionAnswerId, question.getId(), "Empty answer", "N/A", 0, "NONE", 0L, "SUCCESS", null);
            return GradingResult.builder()
                    .score(0)
                    .maxScore(maxPoints)
                    .isCorrect(false)
                    .aiGraded(true)
                    .explanation("AI Sensei Evaluation: No scroll response provided. Chakra score: 0.")
                    .build();
        }

        String prompt = buildPrompt(question, studentAnswer, maxPoints);

        // If API key is present, attempt live LLM call
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                GradingResult result = callGeminiLlm(prompt, question, studentAnswer, maxPoints, submissionAnswerId, startTime);
                if (result != null) {
                    return result;
                }
            } catch (Exception e) {
                log.warn("AI grading API call failed or timed out. Initiating intelligent fallback matching: {}", e.getMessage());
            }
        }

        // Fallback: Intelligent rubric / semantic keyword matching
        return executeFuzzyFallback(question, studentAnswer, maxPoints, submissionAnswerId, startTime, prompt);
    }

    private String buildPrompt(Question question, String studentAnswer, int maxPoints) {
        return """
                You are the grand Hokage AI Sensei grading a ninja academy technical trial question.
                Question: %s
                Reference Correct Answer: %s
                Grading Rubric & Criteria: %s
                Candidate Student Answer: %s
                Maximum Points: %d
                
                Evaluate the student's answer fairly based on accuracy, conceptual depth, and the rubric.
                Return ONLY valid JSON in this exact structure:
                {
                  "score": <integer from 0 to %d>,
                  "isCorrect": <true if score >= %d else false>,
                  "explanation": "<Constructive 1-2 sentence feedback in authoritative, inspiring Leaf Village Sensei tone>"
                }
                """.formatted(
                question.getQuestionText(),
                question.getCorrectAnswer() != null ? question.getCorrectAnswer() : "None provided",
                question.getRubric() != null ? question.getRubric() : "Conceptual understanding required",
                studentAnswer,
                maxPoints,
                maxPoints,
                (int) Math.ceil(maxPoints * 0.7)
        );
    }

    private GradingResult callGeminiLlm(String prompt, Question question, String studentAnswer, int maxPoints, Long answerId, long startTime) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> contentObj = Map.of("parts", List.of(textPart));
        Map<String, Object> requestBody = Map.of("contents", List.of(contentObj));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        long latency = System.currentTimeMillis() - startTime;

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            // Extract JSON substring if markdown fences are included
            String cleanJson = text.replaceAll("```json", "").replaceAll("```", "").trim();
            JsonNode parsed = objectMapper.readTree(cleanJson);

            int score = Math.min(maxPoints, Math.max(0, parsed.path("score").asInt()));
            boolean isCorrect = parsed.path("isCorrect").asBoolean(score >= maxPoints * 0.7);
            String explanation = parsed.path("explanation").asText("AI Sensei evaluated the answer based on provided rubric.");

            logAudit(answerId, question.getId(), prompt, response.getBody(), score, modelName, latency, "SUCCESS", null);

            return GradingResult.builder()
                    .score(score)
                    .maxScore(maxPoints)
                    .isCorrect(isCorrect)
                    .aiGraded(true)
                    .explanation(explanation)
                    .build();
        }
        return null;
    }

    private GradingResult executeFuzzyFallback(Question question, String studentAnswer, int maxPoints, Long answerId, long startTime, String prompt) {
        long latency = System.currentTimeMillis() - startTime;
        String rubric = (question.getRubric() != null ? question.getRubric() : "") + " " +
                (question.getCorrectAnswer() != null ? question.getCorrectAnswer() : "");

        String[] keywords = extractSignificantKeywords(rubric);
        int matched = 0;
        String lowerAnswer = studentAnswer.toLowerCase();

        for (String kw : keywords) {
            if (lowerAnswer.contains(kw.toLowerCase())) {
                matched++;
            }
        }

        double matchRatio = keywords.length > 0 ? (double) matched / keywords.length : 0.6;
        int score = (int) Math.round(matchRatio * maxPoints);
        boolean isCorrect = score >= (int) Math.ceil(maxPoints * 0.7);

        String explanation;
        if (score >= maxPoints * 0.85) {
            explanation = "AI Sensei Evaluation: Exemplary technical articulation matching high-priority criteria (" + matched + "/" + keywords.length + " key concepts identified).";
        } else if (isCorrect) {
            explanation = "AI Sensei Evaluation: Adequate foundational understanding demonstrated with room for deeper technical rigor.";
        } else {
            explanation = "AI Sensei Evaluation: Missing essential tactical depth specified in the village academy rubric.";
        }

        logAudit(answerId, question.getId(), prompt, "Fallback scoring applied", score, "FALLBACK_FUZZY", latency, "FALLBACK", null);

        return GradingResult.builder()
                .score(score)
                .maxScore(maxPoints)
                .isCorrect(isCorrect)
                .aiGraded(true)
                .explanation(explanation)
                .build();
    }

    private String[] extractSignificantKeywords(String text) {
        if (text == null || text.isBlank()) {
            return new String[]{"concept", "principle", "method"};
        }
        return Arrays.stream(text.split("[\\s,.:;()\"'/\\-]+"))
                .filter(w -> w.length() > 4)
                .filter(w -> !isCommonStopword(w.toLowerCase()))
                .distinct()
                .limit(8)
                .toArray(String[]::new);
    }

    private boolean isCommonStopword(String word) {
        Set<String> stopwords = Set.of("which", "there", "their", "about", "should", "could", "would", "score", "points", "answer", "student");
        return stopwords.contains(word);
    }

    private void logAudit(Long answerId, Long questionId, String prompt, String rawResponse, Integer score, String model, Long latency, String status, String error) {
        try {
            AiGradingLog logEntry = AiGradingLog.builder()
                    .submissionAnswerId(answerId)
                    .questionId(questionId)
                    .promptSent(prompt.length() > 2000 ? prompt.substring(0, 2000) + "..." : prompt)
                    .rawResponse(rawResponse != null && rawResponse.length() > 3000 ? rawResponse.substring(0, 3000) + "..." : rawResponse)
                    .scoreGiven(score)
                    .modelUsed(model)
                    .latencyMs(latency)
                    .status(status)
                    .errorMessage(error)
                    .build();
            aiGradingLogRepository.save(logEntry);
        } catch (Exception e) {
            log.error("Failed to write AI grading audit log: {}", e.getMessage());
        }
    }
}

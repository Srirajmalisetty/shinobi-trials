package com.app.quizsystem.service;

import com.app.quizsystem.client.GeminiClient;
import com.app.quizsystem.config.GeminiConfig;
import com.app.quizsystem.dto.GeneratedQuestionDTO;
import com.app.quizsystem.exception.QuestionGenerationException;
import com.app.quizsystem.model.*;
import com.app.quizsystem.repository.QuestionGenerationLogRepository;
import com.app.quizsystem.repository.QuestionRepository;
import com.app.quizsystem.repository.TopicRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionGenerationService {

    private static final Logger log = LoggerFactory.getLogger(QuestionGenerationService.class);

    private final GeminiClient geminiClient;
    private final GeminiConfig geminiConfig;
    private final QuestionRepository questionRepository;
    private final QuestionGenerationLogRepository logRepository;
    private final TopicRepository topicRepository;
    private final ObjectMapper objectMapper;

    private String promptTemplate;

    public QuestionGenerationService(GeminiClient geminiClient,
                                     GeminiConfig geminiConfig,
                                     QuestionRepository questionRepository,
                                     QuestionGenerationLogRepository logRepository,
                                     TopicRepository topicRepository,
                                     ObjectMapper objectMapper) {
        this.geminiClient = geminiClient;
        this.geminiConfig = geminiConfig;
        this.questionRepository = questionRepository;
        this.logRepository = logRepository;
        this.topicRepository = topicRepository;
        this.objectMapper = objectMapper;

        loadPromptTemplate();
    }

    private void loadPromptTemplate() {
        try {
            ClassPathResource resource = new ClassPathResource("prompts/question-generation-prompt.txt");
            try (InputStream is = resource.getInputStream()) {
                this.promptTemplate = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            log.error("Failed to load prompts/question-generation-prompt.txt, using fallback inline template", e);
            this.promptTemplate = "Generate {count} quiz questions on topic \"{topic}\" at {difficulty} difficulty. Distribution: {mix}. Return valid JSON array.";
        }
    }

    /**
     * Generates a fresh set of questions for a quiz trial using Gemini,
     * persisting them with isDynamic=true, or falls back to static DB questions.
     */
    @Transactional
    public List<Question> generateOrFetchQuestions(Quiz quiz) {
        String topicName = resolveTopicName(quiz);
        String topicSlug = resolveTopicSlug(quiz);
        String difficulty = quiz.getNinjaRank() != null ? quiz.getNinjaRank().name() : "D";
        int count = 3; // Default trial question count per mission
        String mix = "1 Multiple Choice, 1 True/False, 1 Short Answer";

        if (!geminiConfig.isConfigured()) {
            log.info("Gemini API key not configured. Serving static academy questions for topic '{}'", topicSlug);
            saveLog(topicSlug, difficulty, count, "FALLBACK_NO_KEY", 0L, "GEMINI_API_KEY is not configured or empty.");
            return getFallbackStaticQuestions(quiz);
        }

        long startTime = System.currentTimeMillis();
        try {
            String prompt = buildPrompt(topicName, difficulty, count, mix);
            String rawResponse = geminiClient.generateContent(prompt);
            long latency = System.currentTimeMillis() - startTime;

            List<GeneratedQuestionDTO> dtos = parseQuestionsJson(rawResponse);
            if (dtos.isEmpty()) {
                throw new QuestionGenerationException("Parsed question list was empty");
            }

            List<Question> savedQuestions = new ArrayList<>();
            int order = 1;
            for (GeneratedQuestionDTO dto : dtos) {
                QuestionType qType = dto.resolveQuestionType();
                String optionsJson = qType == QuestionType.MULTIPLE_CHOICE || qType == QuestionType.TRUE_FALSE
                        ? objectMapper.writeValueAsString(dto.getOptions())
                        : "[]";

                Question question = Question.builder()
                        .quizId(quiz.getId())
                        .questionText(dto.getQuestionText())
                        .questionType(qType)
                        .options(optionsJson)
                        .correctAnswer(dto.getCorrectAnswer())
                        .rubric(dto.getExplanation() != null ? dto.getExplanation() : "Demonstrate conceptual understanding.")
                        .points(dto.getPoints() != null ? dto.getPoints() : 10)
                        .orderNum(order++)
                        .isDynamic(true)
                        .build();

                savedQuestions.add(questionRepository.save(question));
            }

            saveLog(topicSlug, difficulty, savedQuestions.size(), "SUCCESS", latency, null);
            log.info("Successfully generated and persisted {} dynamic AI questions for quiz='{}' in {}ms",
                    savedQuestions.size(), quiz.getTitle(), latency);
            return savedQuestions;

        } catch (Exception e) {
            long latency = System.currentTimeMillis() - startTime;
            String status = e.getMessage() != null && e.getMessage().toLowerCase().contains("timeout")
                    ? "FALLBACK_TIMEOUT"
                    : "FALLBACK_PARSE_ERROR";

            log.warn("Dynamic question generation failed for topic '{}' ({}: {}). Reverting gracefully to static DB questions.",
                    topicSlug, status, e.getMessage());
            saveLog(topicSlug, difficulty, count, status, latency, e.getMessage());

            return getFallbackStaticQuestions(quiz);
        }
    }

    private List<Question> getFallbackStaticQuestions(Quiz quiz) {
        List<Question> staticQuestions = questionRepository.findByQuizIdAndIsDynamicFalseOrderByOrderNumAsc(quiz.getId());
        if (staticQuestions.isEmpty()) {
            // If none marked isDynamic=false specifically, return by quizId
            staticQuestions = questionRepository.findByQuizIdOrderByOrderNumAsc(quiz.getId());
        }
        return staticQuestions;
    }

    private String buildPrompt(String topic, String difficulty, int count, String mix) {
        return promptTemplate
                .replace("{topic}", topic)
                .replace("{difficulty}", difficulty)
                .replace("{count}", String.valueOf(count))
                .replace("{mix}", mix);
    }

    private List<GeneratedQuestionDTO> parseQuestionsJson(String rawText) throws Exception {
        String cleanJson = rawText.trim();
        // Remove markdown code fences if present
        if (cleanJson.startsWith("```json")) {
            cleanJson = cleanJson.substring(7);
        } else if (cleanJson.startsWith("```")) {
            cleanJson = cleanJson.substring(3);
        }
        if (cleanJson.endsWith("```")) {
            cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
        }
        cleanJson = cleanJson.trim();

        // Extract JSON array between [ and ]
        int startBracket = cleanJson.indexOf('[');
        int endBracket = cleanJson.lastIndexOf(']');
        if (startBracket >= 0 && endBracket > startBracket) {
            cleanJson = cleanJson.substring(startBracket, endBracket + 1);
        }

        return objectMapper.readValue(cleanJson, new TypeReference<List<GeneratedQuestionDTO>>() {});
    }

    private String resolveTopicSlug(Quiz quiz) {
        if (quiz.getTopic() != null && quiz.getTopic().getSlug() != null) {
            return quiz.getTopic().getSlug();
        }
        if (quiz.getTopicId() != null) {
            return topicRepository.findById(quiz.getTopicId())
                    .map(Topic::getSlug)
                    .orElse("general");
        }
        return quiz.getSlug() != null ? quiz.getSlug() : "general";
    }

    private String resolveTopicName(Quiz quiz) {
        if (quiz.getTopic() != null && quiz.getTopic().getName() != null) {
            return quiz.getTopic().getName();
        }
        if (quiz.getTopicId() != null) {
            return topicRepository.findById(quiz.getTopicId())
                    .map(Topic::getName)
                    .orElse("Shinobi Knowledge");
        }
        return quiz.getTitle();
    }

    private void saveLog(String topicSlug, String difficulty, int count, String status, Long latencyMs, String errorMessage) {
        try {
            QuestionGenerationLog logEntry = QuestionGenerationLog.builder()
                    .topicSlug(topicSlug)
                    .difficultyRank(difficulty)
                    .questionCount(count)
                    .modelUsed(geminiConfig.getModel())
                    .status(status)
                    .latencyMs(latencyMs)
                    .errorMessage(errorMessage)
                    .build();
            logRepository.save(logEntry);
        } catch (Exception e) {
            log.error("Failed to persist question generation audit log: {}", e.getMessage());
        }
    }
}

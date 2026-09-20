package com.app.quizsystem.client;

import com.app.quizsystem.config.GeminiConfig;
import com.app.quizsystem.exception.QuestionGenerationException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class GeminiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiClient.class);

    private final GeminiConfig geminiConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiClient(GeminiConfig geminiConfig) {
        this.geminiConfig = geminiConfig;
        this.objectMapper = new ObjectMapper();

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        int timeout = geminiConfig.getTimeoutMs() > 0 ? geminiConfig.getTimeoutMs() : 10000;
        factory.setConnectTimeout(timeout);
        factory.setReadTimeout(timeout);
        this.restTemplate = new RestTemplate(factory);
    }

    /**
     * Executes the raw HTTP POST to the Gemini generateContent API with 1 retry on timeout/network error.
     *
     * @param prompt The prompt instructing Gemini to generate questions
     * @return Raw text content returned from the model (JSON string)
     */
    public String generateContent(String prompt) {
        if (!geminiConfig.isConfigured()) {
            throw new QuestionGenerationException("GEMINI_API_KEY is not configured or blank.");
        }

        int maxAttempts = 2;
        Exception lastException = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return executeApiCall(prompt);
            } catch (ResourceAccessException e) {
                lastException = e;
                log.warn("Gemini API call timed out or network error on attempt {}/{}: {}", attempt, maxAttempts, e.getMessage());
                if (attempt < maxAttempts) {
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException ignored) {
                        Thread.currentThread().interrupt();
                    }
                }
            } catch (Exception e) {
                lastException = e;
                log.error("Gemini API call failed on attempt {}/{}: {}", attempt, maxAttempts, e.getMessage());
                if (attempt < maxAttempts) {
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException ignored) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }

        throw new QuestionGenerationException("Gemini API generateContent failed after " + maxAttempts + " attempts: " +
                (lastException != null ? lastException.getMessage() : "Unknown error"), lastException);
    }

    private String executeApiCall(String prompt) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" +
                geminiConfig.getModel() + ":generateContent?key=" + geminiConfig.getApiKey();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> contentObj = Map.of("parts", List.of(textPart));

        // Request JSON MIME type so Gemini strictly returns structured JSON
        Map<String, Object> generationConfig = Map.of("responseMimeType", "application/json");

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(contentObj),
                "generationConfig", generationConfig
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new QuestionGenerationException("Gemini API returned non-2xx status: " + response.getStatusCode());
        }

        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode candidate = root.path("candidates").path(0);
        if (candidate.isMissingNode()) {
            throw new QuestionGenerationException("Gemini API response contained no candidates: " + response.getBody());
        }

        JsonNode textNode = candidate.path("content").path("parts").path(0).path("text");
        if (textNode.isMissingNode() || textNode.asText().isBlank()) {
            throw new QuestionGenerationException("Gemini API returned empty text part: " + response.getBody());
        }

        return textNode.asText().trim();
    }
}

package com.app.quizsystem.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiConfig {

    private static final Logger log = LoggerFactory.getLogger(GeminiConfig.class);

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-2.5-flash}")
    private String model;

    @Value("${gemini.api.timeout-ms:10000}")
    private int timeoutMs;

    @PostConstruct
    public void validateConfig() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.warn("⚠️ GEMINI_API_KEY is not set or empty. Shinobi Trials will gracefully fall back to static academy questions from the database.");
        } else {
            log.info("✅ Gemini AI integration active with model: '{}' (timeout: {}ms)", model, timeoutMs);
        }
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getModel() {
        return model;
    }

    public int getTimeoutMs() {
        return timeoutMs;
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }
}

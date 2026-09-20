package com.app.quizsystem.dto;

import java.time.Instant;

public class QuizStartResponseDTO {
    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private Integer timeLimitSeconds;
    private Instant startedAt;
    private Instant expiresAt;

    public QuizStartResponseDTO() {}

    public QuizStartResponseDTO(Long attemptId, Long quizId, String quizTitle, Integer timeLimitSeconds, Instant startedAt, Instant expiresAt) {
        this.attemptId = attemptId;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.timeLimitSeconds = timeLimitSeconds;
        this.startedAt = startedAt;
        this.expiresAt = expiresAt;
    }

    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }
    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }
    public String getQuizTitle() { return quizTitle; }
    public void setQuizTitle(String quizTitle) { this.quizTitle = quizTitle; }
    public Integer getTimeLimitSeconds() { return timeLimitSeconds; }
    public void setTimeLimitSeconds(Integer timeLimitSeconds) { this.timeLimitSeconds = timeLimitSeconds; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}

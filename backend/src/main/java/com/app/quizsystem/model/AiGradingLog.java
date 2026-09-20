package com.app.quizsystem.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ai_grading_logs")
public class AiGradingLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "submission_answer_id")
    private Long submissionAnswerId;

    @Column(name = "question_id")
    private Long questionId;

    @Column(name = "prompt_sent", nullable = false, columnDefinition = "TEXT")
    private String promptSent;

    @Column(name = "raw_response", columnDefinition = "TEXT")
    private String rawResponse;

    @Column(name = "score_given")
    private Integer scoreGiven;

    @Column(name = "model_used", length = 80)
    private String modelUsed;

    @Column(name = "latency_ms")
    private Long latencyMs;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public AiGradingLog() {}

    public AiGradingLog(Long id, Long submissionAnswerId, Long questionId, String promptSent, String rawResponse,
                        Integer scoreGiven, String modelUsed, Long latencyMs, String status, String errorMessage, Instant createdAt) {
        this.id = id;
        this.submissionAnswerId = submissionAnswerId;
        this.questionId = questionId;
        this.promptSent = promptSent;
        this.rawResponse = rawResponse;
        this.scoreGiven = scoreGiven;
        this.modelUsed = modelUsed;
        this.latencyMs = latencyMs;
        this.status = status;
        this.errorMessage = errorMessage;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long submissionAnswerId;
        private Long questionId;
        private String promptSent;
        private String rawResponse;
        private Integer scoreGiven;
        private String modelUsed;
        private Long latencyMs;
        private String status;
        private String errorMessage;
        private Instant createdAt = Instant.now();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder submissionAnswerId(Long submissionAnswerId) { this.submissionAnswerId = submissionAnswerId; return this; }
        public Builder questionId(Long questionId) { this.questionId = questionId; return this; }
        public Builder promptSent(String promptSent) { this.promptSent = promptSent; return this; }
        public Builder rawResponse(String rawResponse) { this.rawResponse = rawResponse; return this; }
        public Builder scoreGiven(Integer scoreGiven) { this.scoreGiven = scoreGiven; return this; }
        public Builder modelUsed(String modelUsed) { this.modelUsed = modelUsed; return this; }
        public Builder latencyMs(Long latencyMs) { this.latencyMs = latencyMs; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder errorMessage(String errorMessage) { this.errorMessage = errorMessage; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public AiGradingLog build() {
            return new AiGradingLog(id, submissionAnswerId, questionId, promptSent, rawResponse, scoreGiven, modelUsed, latencyMs, status, errorMessage, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSubmissionAnswerId() { return submissionAnswerId; }
    public void setSubmissionAnswerId(Long submissionAnswerId) { this.submissionAnswerId = submissionAnswerId; }
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public String getPromptSent() { return promptSent; }
    public void setPromptSent(String promptSent) { this.promptSent = promptSent; }
    public String getRawResponse() { return rawResponse; }
    public void setRawResponse(String rawResponse) { this.rawResponse = rawResponse; }
    public Integer getScoreGiven() { return scoreGiven; }
    public void setScoreGiven(Integer scoreGiven) { this.scoreGiven = scoreGiven; }
    public String getModelUsed() { return modelUsed; }
    public void setModelUsed(String modelUsed) { this.modelUsed = modelUsed; }
    public Long getLatencyMs() { return latencyMs; }
    public void setLatencyMs(Long latencyMs) { this.latencyMs = latencyMs; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

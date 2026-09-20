package com.app.quizsystem.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "question_generation_logs")
public class QuestionGenerationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "topic_slug", length = 100)
    private String topicSlug;

    @Column(name = "difficulty_rank", length = 10)
    private String difficultyRank;

    @Column(name = "question_count")
    private Integer questionCount;

    @Column(name = "model_used", length = 100)
    private String modelUsed;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "latency_ms")
    private Long latencyMs;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public QuestionGenerationLog() {}

    public QuestionGenerationLog(Long id, String topicSlug, String difficultyRank, Integer questionCount,
                                 String modelUsed, String status, Long latencyMs, String errorMessage, Instant createdAt) {
        this.id = id;
        this.topicSlug = topicSlug;
        this.difficultyRank = difficultyRank;
        this.questionCount = questionCount;
        this.modelUsed = modelUsed;
        this.status = status;
        this.latencyMs = latencyMs;
        this.errorMessage = errorMessage;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String topicSlug;
        private String difficultyRank;
        private Integer questionCount;
        private String modelUsed;
        private String status;
        private Long latencyMs;
        private String errorMessage;
        private Instant createdAt = Instant.now();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder topicSlug(String topicSlug) { this.topicSlug = topicSlug; return this; }
        public Builder difficultyRank(String difficultyRank) { this.difficultyRank = difficultyRank; return this; }
        public Builder questionCount(Integer questionCount) { this.questionCount = questionCount; return this; }
        public Builder modelUsed(String modelUsed) { this.modelUsed = modelUsed; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder latencyMs(Long latencyMs) { this.latencyMs = latencyMs; return this; }
        public Builder errorMessage(String errorMessage) { this.errorMessage = errorMessage; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public QuestionGenerationLog build() {
            return new QuestionGenerationLog(id, topicSlug, difficultyRank, questionCount, modelUsed, status, latencyMs, errorMessage, createdAt);
        }
    }

    public Long getId() { return id; }
    public String getTopicSlug() { return topicSlug; }
    public String getDifficultyRank() { return difficultyRank; }
    public Integer getQuestionCount() { return questionCount; }
    public String getModelUsed() { return modelUsed; }
    public String getStatus() { return status; }
    public Long getLatencyMs() { return latencyMs; }
    public String getErrorMessage() { return errorMessage; }
    public Instant getCreatedAt() { return createdAt; }
}

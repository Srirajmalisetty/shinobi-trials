package com.app.quizsystem.dto;

import com.app.quizsystem.model.NinjaRank;
import com.app.quizsystem.model.Quiz;
import java.time.Instant;

public class QuizDTO {
    private Long id;
    private Long topicId;
    private String topicName;
    private String topicSlug;
    private String title;
    private String slug;
    private String description;
    private NinjaRank ninjaRank;
    private Integer timeLimitSeconds;
    private Integer passingScore;
    private Integer totalPoints;
    private Integer chakraReward;
    private Boolean active;
    private Integer questionCount;
    private Instant createdAt;

    public QuizDTO() {}

    public QuizDTO(Long id, Long topicId, String topicName, String topicSlug, String title, String slug,
                   String description, NinjaRank ninjaRank, Integer timeLimitSeconds, Integer passingScore,
                   Integer totalPoints, Integer chakraReward, Boolean active, Integer questionCount, Instant createdAt) {
        this.id = id;
        this.topicId = topicId;
        this.topicName = topicName;
        this.topicSlug = topicSlug;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.ninjaRank = ninjaRank;
        this.timeLimitSeconds = timeLimitSeconds;
        this.passingScore = passingScore;
        this.totalPoints = totalPoints;
        this.chakraReward = chakraReward;
        this.active = active;
        this.questionCount = questionCount;
        this.createdAt = createdAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long topicId;
        private String topicName;
        private String topicSlug;
        private String title;
        private String slug;
        private String description;
        private NinjaRank ninjaRank;
        private Integer timeLimitSeconds;
        private Integer passingScore;
        private Integer totalPoints;
        private Integer chakraReward;
        private Boolean active;
        private Integer questionCount;
        private Instant createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder topicId(Long topicId) { this.topicId = topicId; return this; }
        public Builder topicName(String topicName) { this.topicName = topicName; return this; }
        public Builder topicSlug(String topicSlug) { this.topicSlug = topicSlug; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder slug(String slug) { this.slug = slug; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder ninjaRank(NinjaRank ninjaRank) { this.ninjaRank = ninjaRank; return this; }
        public Builder timeLimitSeconds(Integer timeLimitSeconds) { this.timeLimitSeconds = timeLimitSeconds; return this; }
        public Builder passingScore(Integer passingScore) { this.passingScore = passingScore; return this; }
        public Builder totalPoints(Integer totalPoints) { this.totalPoints = totalPoints; return this; }
        public Builder chakraReward(Integer chakraReward) { this.chakraReward = chakraReward; return this; }
        public Builder active(Boolean active) { this.active = active; return this; }
        public Builder questionCount(Integer questionCount) { this.questionCount = questionCount; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public QuizDTO build() {
            return new QuizDTO(id, topicId, topicName, topicSlug, title, slug, description, ninjaRank, timeLimitSeconds, passingScore, totalPoints, chakraReward, active, questionCount, createdAt);
        }
    }

    public static QuizDTO fromEntity(Quiz quiz) {
        String topicName = quiz.getTopic() != null ? quiz.getTopic().getName() : null;
        String topicSlug = quiz.getTopic() != null ? quiz.getTopic().getSlug() : null;
        int count = quiz.getQuestions() != null ? quiz.getQuestions().size() : 0;

        return QuizDTO.builder()
                .id(quiz.getId())
                .topicId(quiz.getTopicId())
                .topicName(topicName)
                .topicSlug(topicSlug)
                .title(quiz.getTitle())
                .slug(quiz.getSlug())
                .description(quiz.getDescription())
                .ninjaRank(quiz.getNinjaRank())
                .timeLimitSeconds(quiz.getTimeLimitSeconds())
                .passingScore(quiz.getPassingScore())
                .totalPoints(quiz.getTotalPoints())
                .chakraReward(quiz.getChakraReward())
                .active(quiz.getActive())
                .questionCount(count)
                .createdAt(quiz.getCreatedAt())
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }
    public String getTopicName() { return topicName; }
    public void setTopicName(String topicName) { this.topicName = topicName; }
    public String getTopicSlug() { return topicSlug; }
    public void setTopicSlug(String topicSlug) { this.topicSlug = topicSlug; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public NinjaRank getNinjaRank() { return ninjaRank; }
    public void setNinjaRank(NinjaRank ninjaRank) { this.ninjaRank = ninjaRank; }
    public Integer getTimeLimitSeconds() { return timeLimitSeconds; }
    public void setTimeLimitSeconds(Integer timeLimitSeconds) { this.timeLimitSeconds = timeLimitSeconds; }
    public Integer getPassingScore() { return passingScore; }
    public void setPassingScore(Integer passingScore) { this.passingScore = passingScore; }
    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }
    public Integer getChakraReward() { return chakraReward; }
    public void setChakraReward(Integer chakraReward) { this.chakraReward = chakraReward; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Integer getQuestionCount() { return questionCount; }
    public void setQuestionCount(Integer questionCount) { this.questionCount = questionCount; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

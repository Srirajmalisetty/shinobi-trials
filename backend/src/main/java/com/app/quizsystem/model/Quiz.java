package com.app.quizsystem.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "topic_id")
    private Long topicId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", insertable = false, updatable = false)
    private Topic topic;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "ninja_rank", nullable = false, length = 10)
    private NinjaRank ninjaRank = NinjaRank.D;

    @Column(name = "time_limit_seconds", nullable = false)
    private Integer timeLimitSeconds = 600;

    @Column(name = "passing_score", nullable = false)
    private Integer passingScore = 70;

    @Column(name = "total_points", nullable = false)
    private Integer totalPoints = 100;

    @Column(name = "chakra_reward", nullable = false)
    private Integer chakraReward = 250;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orderNum ASC")
    private List<Question> questions = new ArrayList<>();

    public Quiz() {}

    public Quiz(Long id, Long topicId, String title, String slug, String description, NinjaRank ninjaRank,
                Integer timeLimitSeconds, Integer passingScore, Integer totalPoints, Integer chakraReward,
                Boolean active, Instant createdAt, Instant updatedAt, List<Question> questions) {
        this.id = id;
        this.topicId = topicId;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.ninjaRank = ninjaRank != null ? ninjaRank : NinjaRank.D;
        this.timeLimitSeconds = timeLimitSeconds != null ? timeLimitSeconds : 600;
        this.passingScore = passingScore != null ? passingScore : 70;
        this.totalPoints = totalPoints != null ? totalPoints : 100;
        this.chakraReward = chakraReward != null ? chakraReward : 250;
        this.active = active != null ? active : true;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
        this.questions = questions != null ? questions : new ArrayList<>();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long topicId;
        private String title;
        private String slug;
        private String description;
        private NinjaRank ninjaRank = NinjaRank.D;
        private Integer timeLimitSeconds = 600;
        private Integer passingScore = 70;
        private Integer totalPoints = 100;
        private Integer chakraReward = 250;
        private Boolean active = true;
        private Instant createdAt = Instant.now();
        private Instant updatedAt = Instant.now();
        private List<Question> questions = new ArrayList<>();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder topicId(Long topicId) { this.topicId = topicId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder slug(String slug) { this.slug = slug; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder ninjaRank(NinjaRank ninjaRank) { this.ninjaRank = ninjaRank; return this; }
        public Builder timeLimitSeconds(Integer timeLimitSeconds) { this.timeLimitSeconds = timeLimitSeconds; return this; }
        public Builder passingScore(Integer passingScore) { this.passingScore = passingScore; return this; }
        public Builder totalPoints(Integer totalPoints) { this.totalPoints = totalPoints; return this; }
        public Builder chakraReward(Integer chakraReward) { this.chakraReward = chakraReward; return this; }
        public Builder active(Boolean active) { this.active = active; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder questions(List<Question> questions) { this.questions = questions; return this; }

        public Quiz build() {
            return new Quiz(id, topicId, title, slug, description, ninjaRank, timeLimitSeconds, passingScore, totalPoints, chakraReward, active, createdAt, updatedAt, questions);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }
    public Topic getTopic() { return topic; }
    public void setTopic(Topic topic) { this.topic = topic; }
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
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
}

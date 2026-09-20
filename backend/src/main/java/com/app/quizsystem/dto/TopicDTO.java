package com.app.quizsystem.dto;

import com.app.quizsystem.model.Topic;
import java.time.Instant;

public class TopicDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String iconRef;
    private String refreshFrequency;
    private Instant createdAt;
    private Long quizCount;

    public TopicDTO() {}

    public TopicDTO(Long id, String name, String slug, String description, String iconRef, String refreshFrequency, Instant createdAt, Long quizCount) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.iconRef = iconRef;
        this.refreshFrequency = refreshFrequency;
        this.createdAt = createdAt;
        this.quizCount = quizCount;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String slug;
        private String description;
        private String iconRef;
        private String refreshFrequency;
        private Instant createdAt;
        private Long quizCount;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder slug(String slug) { this.slug = slug; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder iconRef(String iconRef) { this.iconRef = iconRef; return this; }
        public Builder refreshFrequency(String refreshFrequency) { this.refreshFrequency = refreshFrequency; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder quizCount(Long quizCount) { this.quizCount = quizCount; return this; }

        public TopicDTO build() {
            return new TopicDTO(id, name, slug, description, iconRef, refreshFrequency, createdAt, quizCount);
        }
    }

    public static TopicDTO fromEntity(Topic topic, Long quizCount) {
        return TopicDTO.builder()
                .id(topic.getId())
                .name(topic.getName())
                .slug(topic.getSlug())
                .description(topic.getDescription())
                .iconRef(topic.getIconRef())
                .refreshFrequency(topic.getRefreshFrequency())
                .createdAt(topic.getCreatedAt())
                .quizCount(quizCount)
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIconRef() { return iconRef; }
    public void setIconRef(String iconRef) { this.iconRef = iconRef; }
    public String getRefreshFrequency() { return refreshFrequency; }
    public void setRefreshFrequency(String refreshFrequency) { this.refreshFrequency = refreshFrequency; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Long getQuizCount() { return quizCount; }
    public void setQuizCount(Long quizCount) { this.quizCount = quizCount; }
}

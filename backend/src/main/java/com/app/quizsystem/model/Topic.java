package com.app.quizsystem.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_ref", length = 80)
    private String iconRef;

    @Column(name = "refresh_frequency", length = 50)
    private String refreshFrequency;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public Topic() {}

    public Topic(Long id, String name, String slug, String description, String iconRef, String refreshFrequency, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.iconRef = iconRef;
        this.refreshFrequency = refreshFrequency;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String slug;
        private String description;
        private String iconRef;
        private String refreshFrequency;
        private Instant createdAt = Instant.now();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder slug(String slug) { this.slug = slug; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder iconRef(String iconRef) { this.iconRef = iconRef; return this; }
        public Builder refreshFrequency(String refreshFrequency) { this.refreshFrequency = refreshFrequency; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Topic build() {
            return new Topic(id, name, slug, description, iconRef, refreshFrequency, createdAt);
        }
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
}

package com.app.quizsystem.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class AdminOverrideDTO {
    @NotNull(message = "Score awarded is required")
    @Min(value = 0, message = "Score cannot be negative")
    @Max(value = 100, message = "Score cannot exceed 100")
    private Integer scoreAwarded;

    private String adminFeedback;
    private String reviewedBy;

    public AdminOverrideDTO() {}

    public AdminOverrideDTO(Integer scoreAwarded, String adminFeedback, String reviewedBy) {
        this.scoreAwarded = scoreAwarded;
        this.adminFeedback = adminFeedback;
        this.reviewedBy = reviewedBy;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer scoreAwarded;
        private String adminFeedback;
        private String reviewedBy;

        public Builder scoreAwarded(Integer scoreAwarded) { this.scoreAwarded = scoreAwarded; return this; }
        public Builder adminFeedback(String adminFeedback) { this.adminFeedback = adminFeedback; return this; }
        public Builder reviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; return this; }

        public AdminOverrideDTO build() {
            return new AdminOverrideDTO(scoreAwarded, adminFeedback, reviewedBy);
        }
    }

    public Integer getScoreAwarded() { return scoreAwarded; }
    public void setScoreAwarded(Integer scoreAwarded) { this.scoreAwarded = scoreAwarded; }
    public String getAdminFeedback() { return adminFeedback; }
    public void setAdminFeedback(String adminFeedback) { this.adminFeedback = adminFeedback; }
    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
}

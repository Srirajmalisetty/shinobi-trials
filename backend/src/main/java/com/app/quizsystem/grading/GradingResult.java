package com.app.quizsystem.grading;

public class GradingResult {
    private final Integer score;
    private final Integer maxScore;
    private final Boolean isCorrect;
    private final Boolean aiGraded;
    private final String explanation;

    public GradingResult(Integer score, Integer maxScore, Boolean isCorrect, Boolean aiGraded, String explanation) {
        this.score = score;
        this.maxScore = maxScore;
        this.isCorrect = isCorrect;
        this.aiGraded = aiGraded;
        this.explanation = explanation;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer score;
        private Integer maxScore;
        private Boolean isCorrect;
        private Boolean aiGraded;
        private String explanation;

        public Builder score(Integer score) { this.score = score; return this; }
        public Builder maxScore(Integer maxScore) { this.maxScore = maxScore; return this; }
        public Builder isCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; return this; }
        public Builder aiGraded(Boolean aiGraded) { this.aiGraded = aiGraded; return this; }
        public Builder explanation(String explanation) { this.explanation = explanation; return this; }

        public GradingResult build() {
            return new GradingResult(score, maxScore, isCorrect, aiGraded, explanation);
        }
    }

    public Integer getScore() { return score; }
    public Integer getMaxScore() { return maxScore; }
    public Boolean getIsCorrect() { return isCorrect; }
    public Boolean getAiGraded() { return aiGraded; }
    public String getExplanation() { return explanation; }
}

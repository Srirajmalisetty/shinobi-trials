package com.app.quizsystem.dto;

import com.app.quizsystem.model.QuestionType;

public class AnswerResultDTO {
    private Long questionId;
    private String questionText;
    private QuestionType questionType;
    private String studentAnswer;
    private String correctAnswer;
    private Integer scoreAwarded;
    private Integer maxScore;
    private Boolean isCorrect;
    private Boolean aiGraded;
    private String aiExplanation;
    private Boolean adminOverridden;
    private String adminFeedback;

    public AnswerResultDTO() {}

    public AnswerResultDTO(Long questionId, String questionText, QuestionType questionType, String studentAnswer,
                           String correctAnswer, Integer scoreAwarded, Integer maxScore, Boolean isCorrect,
                           Boolean aiGraded, String aiExplanation, Boolean adminOverridden, String adminFeedback) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.questionType = questionType;
        this.studentAnswer = studentAnswer;
        this.correctAnswer = correctAnswer;
        this.scoreAwarded = scoreAwarded;
        this.maxScore = maxScore;
        this.isCorrect = isCorrect;
        this.aiGraded = aiGraded;
        this.aiExplanation = aiExplanation;
        this.adminOverridden = adminOverridden;
        this.adminFeedback = adminFeedback;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long questionId;
        private String questionText;
        private QuestionType questionType;
        private String studentAnswer;
        private String correctAnswer;
        private Integer scoreAwarded;
        private Integer maxScore;
        private Boolean isCorrect;
        private Boolean aiGraded;
        private String aiExplanation;
        private Boolean adminOverridden;
        private String adminFeedback;

        public Builder questionId(Long questionId) { this.questionId = questionId; return this; }
        public Builder questionText(String questionText) { this.questionText = questionText; return this; }
        public Builder questionType(QuestionType questionType) { this.questionType = questionType; return this; }
        public Builder studentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; return this; }
        public Builder correctAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; return this; }
        public Builder scoreAwarded(Integer scoreAwarded) { this.scoreAwarded = scoreAwarded; return this; }
        public Builder maxScore(Integer maxScore) { this.maxScore = maxScore; return this; }
        public Builder isCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; return this; }
        public Builder aiGraded(Boolean aiGraded) { this.aiGraded = aiGraded; return this; }
        public Builder aiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; return this; }
        public Builder adminOverridden(Boolean adminOverridden) { this.adminOverridden = adminOverridden; return this; }
        public Builder adminFeedback(String adminFeedback) { this.adminFeedback = adminFeedback; return this; }

        public AnswerResultDTO build() {
            return new AnswerResultDTO(questionId, questionText, questionType, studentAnswer, correctAnswer, scoreAwarded, maxScore, isCorrect, aiGraded, aiExplanation, adminOverridden, adminFeedback);
        }
    }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public QuestionType getQuestionType() { return questionType; }
    public void setQuestionType(QuestionType questionType) { this.questionType = questionType; }
    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }
    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
    public Integer getScoreAwarded() { return scoreAwarded; }
    public void setScoreAwarded(Integer scoreAwarded) { this.scoreAwarded = scoreAwarded; }
    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }
    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
    public Boolean getAiGraded() { return aiGraded; }
    public void setAiGraded(Boolean aiGraded) { this.aiGraded = aiGraded; }
    public String getAiExplanation() { return aiExplanation; }
    public void setAiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; }
    public Boolean getAdminOverridden() { return adminOverridden; }
    public void setAdminOverridden(Boolean adminOverridden) { this.adminOverridden = adminOverridden; }
    public String getAdminFeedback() { return adminFeedback; }
    public void setAdminFeedback(String adminFeedback) { this.adminFeedback = adminFeedback; }
}

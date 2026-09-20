package com.app.quizsystem.dto;

import jakarta.validation.constraints.NotNull;

public class AnswerSubmissionDTO {
    @NotNull(message = "Question ID is required")
    private Long questionId;

    private String studentAnswer;

    public AnswerSubmissionDTO() {}

    public AnswerSubmissionDTO(Long questionId, String studentAnswer) {
        this.questionId = questionId;
        this.studentAnswer = studentAnswer;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long questionId;
        private String studentAnswer;

        public Builder questionId(Long questionId) { this.questionId = questionId; return this; }
        public Builder studentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; return this; }

        public AnswerSubmissionDTO build() {
            return new AnswerSubmissionDTO(questionId, studentAnswer);
        }
    }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }
    public String getAnswer() { return studentAnswer; }
    public void setAnswer(String answer) { this.studentAnswer = answer; }
}

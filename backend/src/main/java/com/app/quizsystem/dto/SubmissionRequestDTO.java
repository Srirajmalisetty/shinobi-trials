package com.app.quizsystem.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public class SubmissionRequestDTO {
    @NotNull(message = "Quiz ID is required")
    private Long quizId;

    private Long attemptId;
    private UUID userId;

    private String studentName;
    private String studentEmail;
    private Integer timeSpentSeconds;

    @NotEmpty(message = "Answers cannot be empty")
    @Valid
    private List<AnswerSubmissionDTO> answers;

    public SubmissionRequestDTO() {}

    public SubmissionRequestDTO(Long quizId, Long attemptId, UUID userId, String studentName, String studentEmail, Integer timeSpentSeconds, List<AnswerSubmissionDTO> answers) {
        this.quizId = quizId;
        this.attemptId = attemptId;
        this.userId = userId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.timeSpentSeconds = timeSpentSeconds;
        this.answers = answers;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long quizId;
        private Long attemptId;
        private UUID userId;
        private String studentName;
        private String studentEmail;
        private Integer timeSpentSeconds;
        private List<AnswerSubmissionDTO> answers;

        public Builder quizId(Long quizId) { this.quizId = quizId; return this; }
        public Builder attemptId(Long attemptId) { this.attemptId = attemptId; return this; }
        public Builder userId(UUID userId) { this.userId = userId; return this; }

        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
        public Builder timeSpentSeconds(Integer timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; return this; }
        public Builder answers(List<AnswerSubmissionDTO> answers) { this.answers = answers; return this; }

        public SubmissionRequestDTO build() {
            return new SubmissionRequestDTO(quizId, attemptId, userId, studentName, studentEmail, timeSpentSeconds, answers);
        }
    }

    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }
    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public Integer getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(Integer timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }
    public List<AnswerSubmissionDTO> getAnswers() { return answers; }
    public void setAnswers(List<AnswerSubmissionDTO> answers) { this.answers = answers; }
}

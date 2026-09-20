package com.app.quizsystem.dto;

import com.app.quizsystem.model.SubmissionAnswer;
import java.time.Instant;

public class AiReviewDTO {
    private Long id;
    private Long submissionId;
    private Long questionId;
    private String studentName;
    private String quizTitle;
    private String questionText;
    private String studentAnswer;
    private String correctAnswer;
    private String rubric;
    private Integer scoreAwarded;
    private Integer maxScore;
    private String aiExplanation;
    private Boolean adminOverridden;
    private String adminFeedback;
    private String reviewedBy;
    private Instant createdAt;

    public AiReviewDTO() {}

    public AiReviewDTO(Long id, Long submissionId, Long questionId, String studentName, String quizTitle,
                       String questionText, String studentAnswer, String correctAnswer, String rubric,
                       Integer scoreAwarded, Integer maxScore, String aiExplanation, Boolean adminOverridden,
                       String adminFeedback, String reviewedBy, Instant createdAt) {
        this.id = id;
        this.submissionId = submissionId;
        this.questionId = questionId;
        this.studentName = studentName;
        this.quizTitle = quizTitle;
        this.questionText = questionText;
        this.studentAnswer = studentAnswer;
        this.correctAnswer = correctAnswer;
        this.rubric = rubric;
        this.scoreAwarded = scoreAwarded;
        this.maxScore = maxScore;
        this.aiExplanation = aiExplanation;
        this.adminOverridden = adminOverridden;
        this.adminFeedback = adminFeedback;
        this.reviewedBy = reviewedBy;
        this.createdAt = createdAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long submissionId;
        private Long questionId;
        private String studentName;
        private String quizTitle;
        private String questionText;
        private String studentAnswer;
        private String correctAnswer;
        private String rubric;
        private Integer scoreAwarded;
        private Integer maxScore;
        private String aiExplanation;
        private Boolean adminOverridden;
        private String adminFeedback;
        private String reviewedBy;
        private Instant createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder submissionId(Long submissionId) { this.submissionId = submissionId; return this; }
        public Builder questionId(Long questionId) { this.questionId = questionId; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder quizTitle(String quizTitle) { this.quizTitle = quizTitle; return this; }
        public Builder questionText(String questionText) { this.questionText = questionText; return this; }
        public Builder studentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; return this; }
        public Builder correctAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; return this; }
        public Builder rubric(String rubric) { this.rubric = rubric; return this; }
        public Builder scoreAwarded(Integer scoreAwarded) { this.scoreAwarded = scoreAwarded; return this; }
        public Builder maxScore(Integer maxScore) { this.maxScore = maxScore; return this; }
        public Builder aiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; return this; }
        public Builder adminOverridden(Boolean adminOverridden) { this.adminOverridden = adminOverridden; return this; }
        public Builder adminFeedback(String adminFeedback) { this.adminFeedback = adminFeedback; return this; }
        public Builder reviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public AiReviewDTO build() {
            return new AiReviewDTO(id, submissionId, questionId, studentName, quizTitle, questionText, studentAnswer, correctAnswer, rubric, scoreAwarded, maxScore, aiExplanation, adminOverridden, adminFeedback, reviewedBy, createdAt);
        }
    }

    public static AiReviewDTO fromEntity(SubmissionAnswer answer) {
        String studentName = answer.getSubmission() != null ? answer.getSubmission().getStudentName() : "Shinobi Candidate";
        String quizTitle = answer.getQuestion() != null && answer.getQuestion().getQuiz() != null
                ? answer.getQuestion().getQuiz().getTitle() : "Shinobi Exam";
        String questionText = answer.getQuestion() != null ? answer.getQuestion().getQuestionText() : "";
        String correctAnswer = answer.getQuestion() != null ? answer.getQuestion().getCorrectAnswer() : "";
        String rubric = answer.getQuestion() != null ? answer.getQuestion().getRubric() : "";

        return AiReviewDTO.builder()
                .id(answer.getId())
                .submissionId(answer.getSubmissionId())
                .questionId(answer.getQuestionId())
                .studentName(studentName)
                .quizTitle(quizTitle)
                .questionText(questionText)
                .studentAnswer(answer.getStudentAnswer())
                .correctAnswer(correctAnswer)
                .rubric(rubric)
                .scoreAwarded(answer.getScoreAwarded())
                .maxScore(answer.getMaxScore())
                .aiExplanation(answer.getAiExplanation())
                .adminOverridden(answer.getAdminOverridden())
                .adminFeedback(answer.getAdminFeedback())
                .reviewedBy(answer.getReviewedBy())
                .createdAt(answer.getCreatedAt())
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getQuizTitle() { return quizTitle; }
    public void setQuizTitle(String quizTitle) { this.quizTitle = quizTitle; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }
    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
    public String getRubric() { return rubric; }
    public void setRubric(String rubric) { this.rubric = rubric; }
    public Integer getScoreAwarded() { return scoreAwarded; }
    public void setScoreAwarded(Integer scoreAwarded) { this.scoreAwarded = scoreAwarded; }
    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }
    public String getAiExplanation() { return aiExplanation; }
    public void setAiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; }
    public Boolean getAdminOverridden() { return adminOverridden; }
    public void setAdminOverridden(Boolean adminOverridden) { this.adminOverridden = adminOverridden; }
    public String getAdminFeedback() { return adminFeedback; }
    public void setAdminFeedback(String adminFeedback) { this.adminFeedback = adminFeedback; }
    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

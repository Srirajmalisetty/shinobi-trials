package com.app.quizsystem.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "submission_answers")
public class SubmissionAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "submission_id", nullable = false)
    private Long submissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", insertable = false, updatable = false)
    private Submission submission;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", insertable = false, updatable = false)
    private Question question;

    @Column(name = "student_answer", columnDefinition = "TEXT")
    private String studentAnswer;

    @Column(name = "score_awarded", nullable = false)
    private Integer scoreAwarded = 0;

    @Column(name = "max_score", nullable = false)
    private Integer maxScore = 10;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;

    @Column(name = "ai_graded", nullable = false)
    private Boolean aiGraded = false;

    @Column(name = "ai_explanation", columnDefinition = "TEXT")
    private String aiExplanation;

    @Column(name = "admin_overridden", nullable = false)
    private Boolean adminOverridden = false;

    @Column(name = "admin_feedback", columnDefinition = "TEXT")
    private String adminFeedback;

    @Column(name = "reviewed_by", length = 100)
    private String reviewedBy;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public SubmissionAnswer() {}

    public SubmissionAnswer(Long id, Long submissionId, Long questionId, String studentAnswer,
                            Integer scoreAwarded, Integer maxScore, Boolean isCorrect, Boolean aiGraded,
                            String aiExplanation, Boolean adminOverridden, String adminFeedback,
                            String reviewedBy, Instant createdAt) {
        this.id = id;
        this.submissionId = submissionId;
        this.questionId = questionId;
        this.studentAnswer = studentAnswer;
        this.scoreAwarded = scoreAwarded != null ? scoreAwarded : 0;
        this.maxScore = maxScore != null ? maxScore : 10;
        this.isCorrect = isCorrect != null ? isCorrect : false;
        this.aiGraded = aiGraded != null ? aiGraded : false;
        this.aiExplanation = aiExplanation;
        this.adminOverridden = adminOverridden != null ? adminOverridden : false;
        this.adminFeedback = adminFeedback;
        this.reviewedBy = reviewedBy;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long submissionId;
        private Long questionId;
        private String studentAnswer;
        private Integer scoreAwarded = 0;
        private Integer maxScore = 10;
        private Boolean isCorrect = false;
        private Boolean aiGraded = false;
        private String aiExplanation;
        private Boolean adminOverridden = false;
        private String adminFeedback;
        private String reviewedBy;
        private Instant createdAt = Instant.now();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder submissionId(Long submissionId) { this.submissionId = submissionId; return this; }
        public Builder questionId(Long questionId) { this.questionId = questionId; return this; }
        public Builder studentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; return this; }
        public Builder scoreAwarded(Integer scoreAwarded) { this.scoreAwarded = scoreAwarded; return this; }
        public Builder maxScore(Integer maxScore) { this.maxScore = maxScore; return this; }
        public Builder isCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; return this; }
        public Builder aiGraded(Boolean aiGraded) { this.aiGraded = aiGraded; return this; }
        public Builder aiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; return this; }
        public Builder adminOverridden(Boolean adminOverridden) { this.adminOverridden = adminOverridden; return this; }
        public Builder adminFeedback(String adminFeedback) { this.adminFeedback = adminFeedback; return this; }
        public Builder reviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public SubmissionAnswer build() {
            return new SubmissionAnswer(id, submissionId, questionId, studentAnswer, scoreAwarded, maxScore, isCorrect, aiGraded, aiExplanation, adminOverridden, adminFeedback, reviewedBy, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
    public Submission getSubmission() { return submission; }
    public void setSubmission(Submission submission) { this.submission = submission; }
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }
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
    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

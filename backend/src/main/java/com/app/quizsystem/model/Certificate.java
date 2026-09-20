package com.app.quizsystem.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "submission_id", nullable = false, unique = true)
    private Long submissionId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", insertable = false, updatable = false)
    private Submission submission;

    @Column(name = "user_id")
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "certificate_code", nullable = false, unique = true, length = 64)
    private String certificateCode;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "quiz_title", nullable = false)
    private String quizTitle;

    @Column(name = "topic_name", nullable = false, length = 100)
    private String topicName;

    @Enumerated(EnumType.STRING)
    @Column(name = "ninja_rank", nullable = false, length = 10)
    private NinjaRank ninjaRank;

    @Column(name = "score_percentage", nullable = false)
    private Double scorePercentage;

    @Column(name = "issued_at", updatable = false)
    private Instant issuedAt = Instant.now();

    @Column(name = "qr_verification_url", nullable = false, columnDefinition = "TEXT")
    private String qrVerificationUrl;

    public Certificate() {}

    public Certificate(Long id, Long submissionId, UUID userId, String certificateCode, String studentName, String quizTitle,
                       String topicName, NinjaRank ninjaRank, Double scorePercentage, Instant issuedAt, String qrVerificationUrl) {
        this.id = id;
        this.submissionId = submissionId;
        this.userId = userId;
        this.certificateCode = certificateCode;
        this.studentName = studentName;
        this.quizTitle = quizTitle;
        this.topicName = topicName;
        this.ninjaRank = ninjaRank;
        this.scorePercentage = scorePercentage;
        this.issuedAt = issuedAt != null ? issuedAt : Instant.now();
        this.qrVerificationUrl = qrVerificationUrl;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long submissionId;
        private UUID userId;
        private String certificateCode;
        private String studentName;
        private String quizTitle;
        private String topicName;
        private NinjaRank ninjaRank;
        private Double scorePercentage;
        private Instant issuedAt = Instant.now();
        private String qrVerificationUrl;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder submissionId(Long submissionId) { this.submissionId = submissionId; return this; }
        public Builder userId(UUID userId) { this.userId = userId; return this; }
        public Builder certificateCode(String certificateCode) { this.certificateCode = certificateCode; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder quizTitle(String quizTitle) { this.quizTitle = quizTitle; return this; }
        public Builder topicName(String topicName) { this.topicName = topicName; return this; }
        public Builder ninjaRank(NinjaRank ninjaRank) { this.ninjaRank = ninjaRank; return this; }
        public Builder scorePercentage(Double scorePercentage) { this.scorePercentage = scorePercentage; return this; }
        public Builder issuedAt(Instant issuedAt) { this.issuedAt = issuedAt; return this; }
        public Builder qrVerificationUrl(String qrVerificationUrl) { this.qrVerificationUrl = qrVerificationUrl; return this; }

        public Certificate build() {
            return new Certificate(id, submissionId, userId, certificateCode, studentName, quizTitle, topicName, ninjaRank, scorePercentage, issuedAt, qrVerificationUrl);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
    public Submission getSubmission() { return submission; }
    public void setSubmission(Submission submission) { this.submission = submission; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getCertificateCode() { return certificateCode; }
    public void setCertificateCode(String certificateCode) { this.certificateCode = certificateCode; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getQuizTitle() { return quizTitle; }
    public void setQuizTitle(String quizTitle) { this.quizTitle = quizTitle; }
    public String getTopicName() { return topicName; }
    public void setTopicName(String topicName) { this.topicName = topicName; }
    public NinjaRank getNinjaRank() { return ninjaRank; }
    public void setNinjaRank(NinjaRank ninjaRank) { this.ninjaRank = ninjaRank; }
    public Double getScorePercentage() { return scorePercentage; }
    public void setScorePercentage(Double scorePercentage) { this.scorePercentage = scorePercentage; }
    public Instant getIssuedAt() { return issuedAt; }
    public void setIssuedAt(Instant issuedAt) { this.issuedAt = issuedAt; }
    public String getQrVerificationUrl() { return qrVerificationUrl; }
    public void setQrVerificationUrl(String qrVerificationUrl) { this.qrVerificationUrl = qrVerificationUrl; }
}

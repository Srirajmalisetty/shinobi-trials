package com.app.quizsystem.dto;

import com.app.quizsystem.model.Certificate;
import com.app.quizsystem.model.NinjaRank;
import java.time.Instant;

public class CertificateDTO {
    private String certificateCode;
    private Long submissionId;
    private String studentName;
    private String quizTitle;
    private String topicName;
    private NinjaRank ninjaRank;
    private Double scorePercentage;
    private Instant issuedAt;
    private String qrVerificationUrl;

    public CertificateDTO() {}

    public CertificateDTO(String certificateCode, Long submissionId, String studentName, String quizTitle,
                          String topicName, NinjaRank ninjaRank, Double scorePercentage, Instant issuedAt, String qrVerificationUrl) {
        this.certificateCode = certificateCode;
        this.submissionId = submissionId;
        this.studentName = studentName;
        this.quizTitle = quizTitle;
        this.topicName = topicName;
        this.ninjaRank = ninjaRank;
        this.scorePercentage = scorePercentage;
        this.issuedAt = issuedAt;
        this.qrVerificationUrl = qrVerificationUrl;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String certificateCode;
        private Long submissionId;
        private String studentName;
        private String quizTitle;
        private String topicName;
        private NinjaRank ninjaRank;
        private Double scorePercentage;
        private Instant issuedAt;
        private String qrVerificationUrl;

        public Builder certificateCode(String certificateCode) { this.certificateCode = certificateCode; return this; }
        public Builder submissionId(Long submissionId) { this.submissionId = submissionId; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder quizTitle(String quizTitle) { this.quizTitle = quizTitle; return this; }
        public Builder topicName(String topicName) { this.topicName = topicName; return this; }
        public Builder ninjaRank(NinjaRank ninjaRank) { this.ninjaRank = ninjaRank; return this; }
        public Builder scorePercentage(Double scorePercentage) { this.scorePercentage = scorePercentage; return this; }
        public Builder issuedAt(Instant issuedAt) { this.issuedAt = issuedAt; return this; }
        public Builder qrVerificationUrl(String qrVerificationUrl) { this.qrVerificationUrl = qrVerificationUrl; return this; }

        public CertificateDTO build() {
            return new CertificateDTO(certificateCode, submissionId, studentName, quizTitle, topicName, ninjaRank, scorePercentage, issuedAt, qrVerificationUrl);
        }
    }

    public static CertificateDTO fromEntity(Certificate cert) {
        return CertificateDTO.builder()
                .certificateCode(cert.getCertificateCode())
                .submissionId(cert.getSubmissionId())
                .studentName(cert.getStudentName())
                .quizTitle(cert.getQuizTitle())
                .topicName(cert.getTopicName())
                .ninjaRank(cert.getNinjaRank())
                .scorePercentage(cert.getScorePercentage())
                .issuedAt(cert.getIssuedAt())
                .qrVerificationUrl(cert.getQrVerificationUrl())
                .build();
    }

    public String getCertificateCode() { return certificateCode; }
    public void setCertificateCode(String certificateCode) { this.certificateCode = certificateCode; }
    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
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

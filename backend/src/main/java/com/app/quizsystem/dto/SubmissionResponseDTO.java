package com.app.quizsystem.dto;

import com.app.quizsystem.model.NinjaRank;
import java.time.Instant;
import java.util.List;

public class SubmissionResponseDTO {
    private Long submissionId;
    private Long quizId;
    private String quizTitle;
    private String topicName;
    private String studentName;
    private String studentEmail;
    private Integer score;
    private Integer totalPossible;
    private Double percentage;
    private Boolean passed;
    private Integer passingScore;
    private NinjaRank rankAwarded;
    private Integer chakraEarned;
    private Integer timeSpentSeconds;
    private Instant submittedAt;
    private String certificateCode;
    private List<AnswerResultDTO> answers;

    public SubmissionResponseDTO() {}

    public SubmissionResponseDTO(Long submissionId, Long quizId, String quizTitle, String topicName,
                                 String studentName, String studentEmail, Integer score, Integer totalPossible,
                                 Double percentage, Boolean passed, Integer passingScore, NinjaRank rankAwarded,
                                 Integer chakraEarned, Integer timeSpentSeconds, Instant submittedAt,
                                 String certificateCode, List<AnswerResultDTO> answers) {
        this.submissionId = submissionId;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.topicName = topicName;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.score = score;
        this.totalPossible = totalPossible;
        this.percentage = percentage;
        this.passed = passed;
        this.passingScore = passingScore;
        this.rankAwarded = rankAwarded;
        this.chakraEarned = chakraEarned;
        this.timeSpentSeconds = timeSpentSeconds;
        this.submittedAt = submittedAt;
        this.certificateCode = certificateCode;
        this.answers = answers;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long submissionId;
        private Long quizId;
        private String quizTitle;
        private String topicName;
        private String studentName;
        private String studentEmail;
        private Integer score;
        private Integer totalPossible;
        private Double percentage;
        private Boolean passed;
        private Integer passingScore;
        private NinjaRank rankAwarded;
        private Integer chakraEarned;
        private Integer timeSpentSeconds;
        private Instant submittedAt;
        private String certificateCode;
        private List<AnswerResultDTO> answers;

        public Builder submissionId(Long submissionId) { this.submissionId = submissionId; return this; }
        public Builder quizId(Long quizId) { this.quizId = quizId; return this; }
        public Builder quizTitle(String quizTitle) { this.quizTitle = quizTitle; return this; }
        public Builder topicName(String topicName) { this.topicName = topicName; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
        public Builder score(Integer score) { this.score = score; return this; }
        public Builder totalPossible(Integer totalPossible) { this.totalPossible = totalPossible; return this; }
        public Builder percentage(Double percentage) { this.percentage = percentage; return this; }
        public Builder passed(Boolean passed) { this.passed = passed; return this; }
        public Builder passingScore(Integer passingScore) { this.passingScore = passingScore; return this; }
        public Builder rankAwarded(NinjaRank rankAwarded) { this.rankAwarded = rankAwarded; return this; }
        public Builder chakraEarned(Integer chakraEarned) { this.chakraEarned = chakraEarned; return this; }
        public Builder timeSpentSeconds(Integer timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; return this; }
        public Builder submittedAt(Instant submittedAt) { this.submittedAt = submittedAt; return this; }
        public Builder certificateCode(String certificateCode) { this.certificateCode = certificateCode; return this; }
        public Builder answers(List<AnswerResultDTO> answers) { this.answers = answers; return this; }
        public Builder results(List<AnswerResultDTO> results) { this.answers = results; return this; }

        public SubmissionResponseDTO build() {
            return new SubmissionResponseDTO(submissionId, quizId, quizTitle, topicName, studentName, studentEmail, score, totalPossible, percentage, passed, passingScore, rankAwarded, chakraEarned, timeSpentSeconds, submittedAt, certificateCode, answers);
        }
    }

    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }
    public String getQuizTitle() { return quizTitle; }
    public void setQuizTitle(String quizTitle) { this.quizTitle = quizTitle; }
    public String getTopicName() { return topicName; }
    public void setTopicName(String topicName) { this.topicName = topicName; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public Integer getTotalPossible() { return totalPossible; }
    public void setTotalPossible(Integer totalPossible) { this.totalPossible = totalPossible; }
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }
    public Integer getPassingScore() { return passingScore; }
    public void setPassingScore(Integer passingScore) { this.passingScore = passingScore; }
    public NinjaRank getRankAwarded() { return rankAwarded; }
    public void setRankAwarded(NinjaRank rankAwarded) { this.rankAwarded = rankAwarded; }
    public Integer getChakraEarned() { return chakraEarned; }
    public void setChakraEarned(Integer chakraEarned) { this.chakraEarned = chakraEarned; }
    public Integer getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(Integer timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
    public String getCertificateCode() { return certificateCode; }
    public void setCertificateCode(String certificateCode) { this.certificateCode = certificateCode; }
    public List<AnswerResultDTO> getAnswers() { return answers; }
    public void setAnswers(List<AnswerResultDTO> answers) { this.answers = answers; }
    public List<AnswerResultDTO> getResults() { return answers; }
    public void setResults(List<AnswerResultDTO> results) { this.answers = results; }
}


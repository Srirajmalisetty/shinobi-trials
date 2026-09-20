package com.app.quizsystem.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quiz_id", nullable = false)
    private Long quizId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", insertable = false, updatable = false)
    private Quiz quiz;

    @Column(name = "user_id")
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "student_email", length = 200)
    private String studentEmail;

    @Column(nullable = false)
    private Integer score = 0;

    @Column(name = "total_possible", nullable = false)
    private Integer totalPossible = 100;

    @Column(nullable = false)
    private Double percentage = 0.0;

    @Column(nullable = false)
    private Boolean passed = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "rank_awarded", length = 10)
    private NinjaRank rankAwarded;

    @Column(name = "time_spent_seconds", nullable = false)
    private Integer timeSpentSeconds = 0;

    @Column(name = "started_at")
    private Instant startedAt = Instant.now();

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(length = 20)
    private String status = "COMPLETED";

    @Column(name = "submitted_at")
    private Instant submittedAt = Instant.now();

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SubmissionAnswer> answers = new ArrayList<>();

    public Submission() {}

    public Submission(Long id, Long quizId, UUID userId, String studentName, String studentEmail, Integer score,
                      Integer totalPossible, Double percentage, Boolean passed, NinjaRank rankAwarded,
                      Integer timeSpentSeconds, Instant startedAt, Instant expiresAt, String status,
                      Instant submittedAt, List<SubmissionAnswer> answers) {
        this.id = id;
        this.quizId = quizId;
        this.userId = userId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.score = score != null ? score : 0;
        this.totalPossible = totalPossible != null ? totalPossible : 100;
        this.percentage = percentage != null ? percentage : 0.0;
        this.passed = passed != null ? passed : false;
        this.rankAwarded = rankAwarded;
        this.timeSpentSeconds = timeSpentSeconds != null ? timeSpentSeconds : 0;
        this.startedAt = startedAt != null ? startedAt : Instant.now();
        this.expiresAt = expiresAt;
        this.status = status != null ? status : "COMPLETED";
        this.submittedAt = submittedAt != null ? submittedAt : Instant.now();
        this.answers = answers != null ? answers : new ArrayList<>();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long quizId;
        private UUID userId;
        private String studentName;
        private String studentEmail;
        private Integer score = 0;
        private Integer totalPossible = 100;
        private Double percentage = 0.0;
        private Boolean passed = false;
        private NinjaRank rankAwarded;
        private Integer timeSpentSeconds = 0;
        private Instant startedAt = Instant.now();
        private Instant expiresAt;
        private String status = "COMPLETED";
        private Instant submittedAt = Instant.now();
        private List<SubmissionAnswer> answers = new ArrayList<>();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder quizId(Long quizId) { this.quizId = quizId; return this; }
        public Builder userId(UUID userId) { this.userId = userId; return this; }
        public Builder studentName(String studentName) { this.studentName = studentName; return this; }
        public Builder studentEmail(String studentEmail) { this.studentEmail = studentEmail; return this; }
        public Builder score(Integer score) { this.score = score; return this; }
        public Builder totalPossible(Integer totalPossible) { this.totalPossible = totalPossible; return this; }
        public Builder percentage(Double percentage) { this.percentage = percentage; return this; }
        public Builder passed(Boolean passed) { this.passed = passed; return this; }
        public Builder rankAwarded(NinjaRank rankAwarded) { this.rankAwarded = rankAwarded; return this; }
        public Builder timeSpentSeconds(Integer timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; return this; }
        public Builder startedAt(Instant startedAt) { this.startedAt = startedAt; return this; }
        public Builder expiresAt(Instant expiresAt) { this.expiresAt = expiresAt; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder submittedAt(Instant submittedAt) { this.submittedAt = submittedAt; return this; }
        public Builder answers(List<SubmissionAnswer> answers) { this.answers = answers; return this; }

        public Submission build() {
            return new Submission(id, quizId, userId, studentName, studentEmail, score, totalPossible, percentage,
                    passed, rankAwarded, timeSpentSeconds, startedAt, expiresAt, status, submittedAt, answers);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }
    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
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
    public NinjaRank getRankAwarded() { return rankAwarded; }
    public void setRankAwarded(NinjaRank rankAwarded) { this.rankAwarded = rankAwarded; }
    public Integer getTimeSpentSeconds() { return timeSpentSeconds; }
    public void setTimeSpentSeconds(Integer timeSpentSeconds) { this.timeSpentSeconds = timeSpentSeconds; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
    public List<SubmissionAnswer> getAnswers() { return answers; }
    public void setAnswers(List<SubmissionAnswer> answers) { this.answers = answers; }
}

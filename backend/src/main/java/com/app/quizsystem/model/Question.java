package com.app.quizsystem.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quiz_id", nullable = false)
    private Long quizId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", insertable = false, updatable = false)
    private Quiz quiz;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false, length = 30)
    private QuestionType questionType;

    @Column(columnDefinition = "TEXT")
    private String options;

    @Column(name = "correct_answer", columnDefinition = "TEXT")
    private String correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String rubric;

    @Column(nullable = false)
    private Integer points = 10;

    @Column(name = "order_num", nullable = false)
    private Integer orderNum = 1;

    @Column(name = "is_dynamic", nullable = false)
    private Boolean isDynamic = false;

    @Column(name = "submission_id")
    private Long submissionId;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    public Question() {}

    public Question(Long id, Long quizId, String questionText, QuestionType questionType, String options,
                    String correctAnswer, String rubric, Integer points, Integer orderNum,
                    Boolean isDynamic, Long submissionId, Instant createdAt) {
        this.id = id;
        this.quizId = quizId;
        this.questionText = questionText;
        this.questionType = questionType;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.rubric = rubric;
        this.points = points != null ? points : 10;
        this.orderNum = orderNum != null ? orderNum : 1;
        this.isDynamic = isDynamic != null ? isDynamic : false;
        this.submissionId = submissionId;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long quizId;
        private String questionText;
        private QuestionType questionType;
        private String options;
        private String correctAnswer;
        private String rubric;
        private Integer points = 10;
        private Integer orderNum = 1;
        private Boolean isDynamic = false;
        private Long submissionId;
        private Instant createdAt = Instant.now();

        public Builder id(Long id) { this.id = id; return this; }
        public Builder quizId(Long quizId) { this.quizId = quizId; return this; }
        public Builder questionText(String questionText) { this.questionText = questionText; return this; }
        public Builder questionType(QuestionType questionType) { this.questionType = questionType; return this; }
        public Builder options(String options) { this.options = options; return this; }
        public Builder correctAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; return this; }
        public Builder rubric(String rubric) { this.rubric = rubric; return this; }
        public Builder points(Integer points) { this.points = points; return this; }
        public Builder orderNum(Integer orderNum) { this.orderNum = orderNum; return this; }
        public Builder isDynamic(Boolean isDynamic) { this.isDynamic = isDynamic; return this; }
        public Builder submissionId(Long submissionId) { this.submissionId = submissionId; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Question build() {
            return new Question(id, quizId, questionText, questionType, options, correctAnswer, rubric, points, orderNum, isDynamic, submissionId, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }
    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public QuestionType getQuestionType() { return questionType; }
    public void setQuestionType(QuestionType questionType) { this.questionType = questionType; }
    public String getOptions() { return options; }
    public void setOptions(String options) { this.options = options; }
    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
    public String getRubric() { return rubric; }
    public void setRubric(String rubric) { this.rubric = rubric; }
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
    public Integer getOrderNum() { return orderNum; }
    public void setOrderNum(Integer orderNum) { this.orderNum = orderNum; }
    public Boolean getIsDynamic() { return isDynamic; }
    public void setIsDynamic(Boolean isDynamic) { this.isDynamic = isDynamic; }
    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

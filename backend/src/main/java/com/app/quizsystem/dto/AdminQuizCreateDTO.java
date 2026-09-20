package com.app.quizsystem.dto;

import com.app.quizsystem.model.NinjaRank;
import com.app.quizsystem.model.QuestionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class AdminQuizCreateDTO {
    @NotNull(message = "Topic ID is required")
    private Long topicId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Ninja Rank is required")
    private NinjaRank ninjaRank;

    private Integer timeLimitSeconds = 600;
    private Integer passingScore = 70;
    private Integer chakraReward = 250;

    @NotEmpty(message = "At least one question is required")
    @Valid
    private List<AdminQuestionCreateDTO> questions;

    public AdminQuizCreateDTO() {}

    public AdminQuizCreateDTO(Long topicId, String title, String description, NinjaRank ninjaRank,
                              Integer timeLimitSeconds, Integer passingScore, Integer chakraReward,
                              List<AdminQuestionCreateDTO> questions) {
        this.topicId = topicId;
        this.title = title;
        this.description = description;
        this.ninjaRank = ninjaRank;
        this.timeLimitSeconds = timeLimitSeconds != null ? timeLimitSeconds : 600;
        this.passingScore = passingScore != null ? passingScore : 70;
        this.chakraReward = chakraReward != null ? chakraReward : 250;
        this.questions = questions;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long topicId;
        private String title;
        private String description;
        private NinjaRank ninjaRank;
        private Integer timeLimitSeconds = 600;
        private Integer passingScore = 70;
        private Integer chakraReward = 250;
        private List<AdminQuestionCreateDTO> questions;

        public Builder topicId(Long topicId) { this.topicId = topicId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder ninjaRank(NinjaRank ninjaRank) { this.ninjaRank = ninjaRank; return this; }
        public Builder timeLimitSeconds(Integer timeLimitSeconds) { this.timeLimitSeconds = timeLimitSeconds; return this; }
        public Builder passingScore(Integer passingScore) { this.passingScore = passingScore; return this; }
        public Builder chakraReward(Integer chakraReward) { this.chakraReward = chakraReward; return this; }
        public Builder questions(List<AdminQuestionCreateDTO> questions) { this.questions = questions; return this; }

        public AdminQuizCreateDTO build() {
            return new AdminQuizCreateDTO(topicId, title, description, ninjaRank, timeLimitSeconds, passingScore, chakraReward, questions);
        }
    }

    public static class AdminQuestionCreateDTO {
        @NotBlank(message = "Question text is required")
        private String questionText;

        @NotNull(message = "Question type is required")
        private QuestionType questionType;

        private List<String> options;
        private String correctAnswer;
        private String rubric;
        private Integer points = 10;

        public AdminQuestionCreateDTO() {}

        public AdminQuestionCreateDTO(String questionText, QuestionType questionType, List<String> options,
                                      String correctAnswer, String rubric, Integer points) {
            this.questionText = questionText;
            this.questionType = questionType;
            this.options = options;
            this.correctAnswer = correctAnswer;
            this.rubric = rubric;
            this.points = points != null ? points : 10;
        }

        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }
        public QuestionType getQuestionType() { return questionType; }
        public void setQuestionType(QuestionType questionType) { this.questionType = questionType; }
        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }
        public String getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
        public String getRubric() { return rubric; }
        public void setRubric(String rubric) { this.rubric = rubric; }
        public Integer getPoints() { return points; }
        public void setPoints(Integer points) { this.points = points; }
    }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public NinjaRank getNinjaRank() { return ninjaRank; }
    public void setNinjaRank(NinjaRank ninjaRank) { this.ninjaRank = ninjaRank; }
    public Integer getTimeLimitSeconds() { return timeLimitSeconds; }
    public void setTimeLimitSeconds(Integer timeLimitSeconds) { this.timeLimitSeconds = timeLimitSeconds; }
    public Integer getPassingScore() { return passingScore; }
    public void setPassingScore(Integer passingScore) { this.passingScore = passingScore; }
    public Integer getChakraReward() { return chakraReward; }
    public void setChakraReward(Integer chakraReward) { this.chakraReward = chakraReward; }
    public List<AdminQuestionCreateDTO> getQuestions() { return questions; }
    public void setQuestions(List<AdminQuestionCreateDTO> questions) { this.questions = questions; }
}

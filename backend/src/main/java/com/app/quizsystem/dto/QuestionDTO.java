package com.app.quizsystem.dto;

import com.app.quizsystem.model.Question;
import com.app.quizsystem.model.QuestionType;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

public class QuestionDTO {
    private Long id;
    private String questionText;
    private QuestionType questionType;
    private List<String> options;
    private Integer points;
    private Integer orderNum;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public QuestionDTO() {}

    public QuestionDTO(Long id, String questionText, QuestionType questionType, List<String> options, Integer points, Integer orderNum) {
        this.id = id;
        this.questionText = questionText;
        this.questionType = questionType;
        this.options = options;
        this.points = points;
        this.orderNum = orderNum;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String questionText;
        private QuestionType questionType;
        private List<String> options;
        private Integer points;
        private Integer orderNum;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder questionText(String questionText) { this.questionText = questionText; return this; }
        public Builder questionType(QuestionType questionType) { this.questionType = questionType; return this; }
        public Builder options(List<String> options) { this.options = options; return this; }
        public Builder points(Integer points) { this.points = points; return this; }
        public Builder orderNum(Integer orderNum) { this.orderNum = orderNum; return this; }

        public QuestionDTO build() {
            return new QuestionDTO(id, questionText, questionType, options, points, orderNum);
        }
    }

    public static QuestionDTO fromEntity(Question question) {
        List<String> parsedOptions = new ArrayList<>();
        if (question.getOptions() != null && !question.getOptions().isBlank()) {
            try {
                parsedOptions = MAPPER.readValue(question.getOptions(), new TypeReference<List<String>>() {});
            } catch (Exception ignored) {}
        }

        return QuestionDTO.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .questionType(question.getQuestionType())
                .options(parsedOptions)
                .points(question.getPoints())
                .orderNum(question.getOrderNum())
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public QuestionType getQuestionType() { return questionType; }
    public void setQuestionType(QuestionType questionType) { this.questionType = questionType; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
    public Integer getOrderNum() { return orderNum; }
    public void setOrderNum(Integer orderNum) { this.orderNum = orderNum; }
}

package com.app.quizsystem.dto;

import com.app.quizsystem.model.QuestionType;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GeneratedQuestionDTO {

    @JsonAlias({"question", "question_text", "prompt"})
    private String questionText;

    @JsonAlias({"questionType", "question_type"})
    private String type;

    private List<String> options = new ArrayList<>();

    @JsonAlias({"correct_answer", "answer"})
    private String correctAnswer;

    @JsonAlias({"rubric", "reasoning", "notes"})
    private String explanation;

    private Integer points = 10;

    public GeneratedQuestionDTO() {}

    public GeneratedQuestionDTO(String questionText, String type, List<String> options, String correctAnswer, String explanation, Integer points) {
        this.questionText = questionText;
        this.type = type;
        this.options = options != null ? options : new ArrayList<>();
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
        this.points = points != null ? points : 10;
    }

    public QuestionType resolveQuestionType() {
        if (type == null) return QuestionType.MULTIPLE_CHOICE;
        String upper = type.trim().toUpperCase().replace("-", "_").replace(" ", "_");
        try {
            return QuestionType.valueOf(upper);
        } catch (IllegalArgumentException e) {
            if (upper.contains("TRUE") || upper.contains("FALSE")) {
                return QuestionType.TRUE_FALSE;
            } else if (upper.contains("SHORT") || upper.contains("ESSAY")) {
                return QuestionType.SHORT_ANSWER;
            }
            return QuestionType.MULTIPLE_CHOICE;
        }
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }
}

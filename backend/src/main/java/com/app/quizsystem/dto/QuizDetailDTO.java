package com.app.quizsystem.dto;

import com.app.quizsystem.model.Quiz;
import java.util.List;
import java.util.stream.Collectors;

public class QuizDetailDTO extends QuizDTO {
    private List<QuestionDTO> questions;

    public QuizDetailDTO() {}

    public static QuizDetailDTO fromEntityWithQuestions(Quiz quiz) {
        return fromEntityWithCustomQuestions(quiz, quiz.getQuestions());
    }

    public static QuizDetailDTO fromEntityWithCustomQuestions(Quiz quiz, List<com.app.quizsystem.model.Question> questions) {
        QuizDTO base = QuizDTO.fromEntity(quiz);
        List<QuestionDTO> questionDTOs = questions != null
                ? questions.stream().map(QuestionDTO::fromEntity).collect(Collectors.toList())
                : List.of();

        QuizDetailDTO detail = new QuizDetailDTO();
        detail.setId(base.getId());
        detail.setTopicId(base.getTopicId());
        detail.setTopicName(base.getTopicName());
        detail.setTopicSlug(base.getTopicSlug());
        detail.setTitle(base.getTitle());
        detail.setSlug(base.getSlug());
        detail.setDescription(base.getDescription());
        detail.setNinjaRank(base.getNinjaRank());
        detail.setTimeLimitSeconds(base.getTimeLimitSeconds());
        detail.setPassingScore(base.getPassingScore());
        detail.setTotalPoints(base.getTotalPoints());
        detail.setChakraReward(base.getChakraReward());
        detail.setActive(base.getActive());
        detail.setQuestionCount(questionDTOs.size());
        detail.setCreatedAt(base.getCreatedAt());
        detail.setQuestions(questionDTOs);
        return detail;
    }

    public List<QuestionDTO> getQuestions() { return questions; }
    public void setQuestions(List<QuestionDTO> questions) { this.questions = questions; }
}

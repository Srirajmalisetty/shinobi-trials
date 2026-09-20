package com.app.quizsystem.grading;

import com.app.quizsystem.model.Question;
import com.app.quizsystem.model.QuestionType;
import org.springframework.stereotype.Component;

@Component
public class AiShortAnswerGrader implements GradingStrategy {

    private final AiGradingClient aiGradingClient;

    public AiShortAnswerGrader(AiGradingClient aiGradingClient) {
        this.aiGradingClient = aiGradingClient;
    }

    @Override
    public QuestionType supportsType() {
        return QuestionType.SHORT_ANSWER;
    }

    @Override
    public GradingResult grade(Question question, String studentAnswer) {
        return aiGradingClient.evaluate(question, studentAnswer, null);
    }
}

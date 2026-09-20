package com.app.quizsystem.grading;

import com.app.quizsystem.model.Question;
import com.app.quizsystem.model.QuestionType;
import org.springframework.stereotype.Component;

@Component
public class MultipleChoiceGrader implements GradingStrategy {

    @Override
    public QuestionType supportsType() {
        return QuestionType.MULTIPLE_CHOICE;
    }

    @Override
    public GradingResult grade(Question question, String studentAnswer) {
        if (studentAnswer == null || studentAnswer.trim().isEmpty()) {
            return GradingResult.builder()
                    .score(0)
                    .maxScore(question.getPoints())
                    .isCorrect(false)
                    .aiGraded(false)
                    .explanation("No answer provided for this multiple-choice question.")
                    .build();
        }

        String expected = question.getCorrectAnswer() != null ? question.getCorrectAnswer().trim() : "";
        String actual = studentAnswer.trim();

        boolean correct = expected.equalsIgnoreCase(actual);

        int points = correct ? question.getPoints() : 0;
        String explanation = correct
                ? "Correct! You successfully identified the correct shinobi principle."
                : "Incorrect. The expected answer was: " + expected;

        return GradingResult.builder()
                .score(points)
                .maxScore(question.getPoints())
                .isCorrect(correct)
                .aiGraded(false)
                .explanation(explanation)
                .build();
    }
}

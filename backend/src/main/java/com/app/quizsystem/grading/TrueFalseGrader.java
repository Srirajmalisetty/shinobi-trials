package com.app.quizsystem.grading;

import com.app.quizsystem.model.Question;
import com.app.quizsystem.model.QuestionType;
import org.springframework.stereotype.Component;

@Component
public class TrueFalseGrader implements GradingStrategy {

    @Override
    public QuestionType supportsType() {
        return QuestionType.TRUE_FALSE;
    }

    @Override
    public GradingResult grade(Question question, String studentAnswer) {
        if (studentAnswer == null || studentAnswer.trim().isEmpty()) {
            return GradingResult.builder()
                    .score(0)
                    .maxScore(question.getPoints())
                    .isCorrect(false)
                    .aiGraded(false)
                    .explanation("No selection recorded.")
                    .build();
        }

        String expected = question.getCorrectAnswer() != null ? question.getCorrectAnswer().trim() : "";
        String actual = studentAnswer.trim();

        // Normalize boolean representations
        boolean expectedBool = Boolean.parseBoolean(expected) || expected.equalsIgnoreCase("true") || expected.equalsIgnoreCase("t");
        boolean actualBool = Boolean.parseBoolean(actual) || actual.equalsIgnoreCase("true") || actual.equalsIgnoreCase("t");

        boolean correct = (expectedBool == actualBool);
        int points = correct ? question.getPoints() : 0;
        String explanation = correct
                ? "Correct! Masterful ninja intuition."
                : "Incorrect. The correct assertion was: " + expected;

        return GradingResult.builder()
                .score(points)
                .maxScore(question.getPoints())
                .isCorrect(correct)
                .aiGraded(false)
                .explanation(explanation)
                .build();
    }
}

package com.app.quizsystem;

import com.app.quizsystem.grading.*;
import com.app.quizsystem.model.Question;
import com.app.quizsystem.model.QuestionType;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class QuizSystemApplicationTests {

    @Test
    void testMultipleChoiceGrader() {
        MultipleChoiceGrader grader = new MultipleChoiceGrader();
        Question q = Question.builder()
                .questionType(QuestionType.MULTIPLE_CHOICE)
                .correctAnswer("ReLU")
                .points(10)
                .build();

        GradingResult result = grader.grade(q, "ReLU");
        assertTrue(result.getIsCorrect());
        assertEquals(10, result.getScore());

        GradingResult wrong = grader.grade(q, "Sigmoid");
        assertFalse(wrong.getIsCorrect());
        assertEquals(0, wrong.getScore());
    }

    @Test
    void testTrueFalseGrader() {
        TrueFalseGrader grader = new TrueFalseGrader();
        Question q = Question.builder()
                .questionType(QuestionType.TRUE_FALSE)
                .correctAnswer("True")
                .points(10)
                .build();

        GradingResult result = grader.grade(q, "true");
        assertTrue(result.getIsCorrect());
        assertEquals(10, result.getScore());

        GradingResult wrong = grader.grade(q, "false");
        assertFalse(wrong.getIsCorrect());
        assertEquals(0, wrong.getScore());
    }

    @Test
    void testGradingStrategyFactory() {
        MultipleChoiceGrader mcq = new MultipleChoiceGrader();
        TrueFalseGrader tf = new TrueFalseGrader();
        GradingStrategyFactory factory = new GradingStrategyFactory(List.of(mcq, tf));

        assertSame(mcq, factory.getStrategy(QuestionType.MULTIPLE_CHOICE));
        assertSame(tf, factory.getStrategy(QuestionType.TRUE_FALSE));
    }
}

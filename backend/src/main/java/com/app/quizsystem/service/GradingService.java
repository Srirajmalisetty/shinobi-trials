package com.app.quizsystem.service;

import com.app.quizsystem.grading.GradingResult;
import com.app.quizsystem.grading.GradingStrategy;
import com.app.quizsystem.grading.GradingStrategyFactory;
import com.app.quizsystem.model.Question;
import org.springframework.stereotype.Service;

@Service
public class GradingService {

    private final GradingStrategyFactory gradingStrategyFactory;

    public GradingService(GradingStrategyFactory gradingStrategyFactory) {
        this.gradingStrategyFactory = gradingStrategyFactory;
    }

    public GradingResult gradeAnswer(Question question, String studentAnswer) {
        GradingStrategy strategy = gradingStrategyFactory.getStrategy(question.getQuestionType());
        return strategy.grade(question, studentAnswer);
    }
}

package com.app.quizsystem.grading;

import com.app.quizsystem.model.QuestionType;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class GradingStrategyFactory {

    private final Map<QuestionType, GradingStrategy> strategies = new EnumMap<>(QuestionType.class);

    public GradingStrategyFactory(List<GradingStrategy> strategyList) {
        for (GradingStrategy strategy : strategyList) {
            strategies.put(strategy.supportsType(), strategy);
        }
    }

    public GradingStrategy getStrategy(QuestionType type) {
        GradingStrategy strategy = strategies.get(type);
        if (strategy == null) {
            throw new IllegalArgumentException("No grading strategy registered for question type: " + type);
        }
        return strategy;
    }
}

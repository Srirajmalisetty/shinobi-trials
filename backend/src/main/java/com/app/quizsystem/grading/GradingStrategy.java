package com.app.quizsystem.grading;

import com.app.quizsystem.model.Question;
import com.app.quizsystem.model.QuestionType;

public interface GradingStrategy {
    QuestionType supportsType();
    GradingResult grade(Question question, String studentAnswer);
}

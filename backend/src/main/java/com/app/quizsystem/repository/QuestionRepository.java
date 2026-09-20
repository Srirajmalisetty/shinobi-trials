package com.app.quizsystem.repository;

import com.app.quizsystem.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuizIdOrderByOrderNumAsc(Long quizId);
    List<Question> findByQuizIdAndIsDynamicFalseOrderByOrderNumAsc(Long quizId);
    List<Question> findBySubmissionIdOrderByOrderNumAsc(Long submissionId);
}

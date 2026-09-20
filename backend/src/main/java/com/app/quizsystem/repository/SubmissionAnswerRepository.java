package com.app.quizsystem.repository;

import com.app.quizsystem.model.SubmissionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionAnswerRepository extends JpaRepository<SubmissionAnswer, Long> {
    List<SubmissionAnswer> findBySubmissionId(Long submissionId);
    List<SubmissionAnswer> findByAiGradedTrueOrderByCreatedAtDesc();
}

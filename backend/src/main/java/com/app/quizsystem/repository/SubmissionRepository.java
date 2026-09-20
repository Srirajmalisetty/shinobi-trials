package com.app.quizsystem.repository;

import com.app.quizsystem.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdOrderBySubmittedAtDesc(UUID userId);
    Optional<Submission> findByIdAndUserId(Long id, UUID userId);
    long countByUserIdAndPassedTrue(UUID userId);
    List<Submission> findByQuizIdAndUserIdOrderBySubmittedAtDesc(Long quizId, UUID userId);
    List<Submission> findAllByOrderBySubmittedAtDesc();
}

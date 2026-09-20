package com.app.quizsystem.repository;

import com.app.quizsystem.model.AiGradingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiGradingLogRepository extends JpaRepository<AiGradingLog, Long> {
    List<AiGradingLog> findBySubmissionAnswerId(Long submissionAnswerId);
    List<AiGradingLog> findTop50ByOrderByCreatedAtDesc();
}

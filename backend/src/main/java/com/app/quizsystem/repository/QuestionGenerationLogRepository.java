package com.app.quizsystem.repository;

import com.app.quizsystem.model.QuestionGenerationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionGenerationLogRepository extends JpaRepository<QuestionGenerationLog, Long> {
    List<QuestionGenerationLog> findByTopicSlugOrderByCreatedAtDesc(String topicSlug);
}

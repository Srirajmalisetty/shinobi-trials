package com.app.quizsystem.repository;

import com.app.quizsystem.model.NinjaRank;
import com.app.quizsystem.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Optional<Quiz> findBySlug(String slug);
    List<Quiz> findByTopicId(Long topicId);
    List<Quiz> findByNinjaRank(NinjaRank ninjaRank);
    List<Quiz> findByActiveTrue();

    @Query("SELECT q FROM Quiz q WHERE q.active = true AND (:topicId IS NULL OR q.topicId = :topicId) AND (:rank IS NULL OR q.ninjaRank = :rank)")
    List<Quiz> searchQuizzes(@Param("topicId") Long topicId, @Param("rank") NinjaRank rank);
}

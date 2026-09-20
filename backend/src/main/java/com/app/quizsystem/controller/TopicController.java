package com.app.quizsystem.controller;

import com.app.quizsystem.dto.QuizDTO;
import com.app.quizsystem.dto.TopicDTO;
import com.app.quizsystem.service.TopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@CrossOrigin(origins = "*")
@Tag(name = "Topics", description = "Endpoints for retrieving quiz topic domains (AI, LLMs, General Knowledge, Current Affairs, Business)")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @GetMapping
    @Operation(summary = "Get all active topics with quiz count")
    public ResponseEntity<List<TopicDTO>> getAllTopics() {
        return ResponseEntity.ok(topicService.getAllTopics());
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get topic details by slug")
    public ResponseEntity<TopicDTO> getTopicBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(topicService.getTopicBySlug(slug));
    }

    @GetMapping("/{slug}/quizzes")
    @Operation(summary = "Get quizzes belonging to a specific topic")
    public ResponseEntity<List<QuizDTO>> getQuizzesByTopic(@PathVariable String slug) {
        return ResponseEntity.ok(topicService.getQuizzesByTopicSlug(slug));
    }
}

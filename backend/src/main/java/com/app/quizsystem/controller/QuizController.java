package com.app.quizsystem.controller;

import com.app.quizsystem.dto.QuizDTO;
import com.app.quizsystem.dto.QuizDetailDTO;
import com.app.quizsystem.dto.QuizStartResponseDTO;
import com.app.quizsystem.model.NinjaRank;
import com.app.quizsystem.security.UserPrincipal;
import com.app.quizsystem.service.QuizService;
import com.app.quizsystem.service.SubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
@Tag(name = "Quizzes", description = "Endpoints for retrieving shinobi exam trials and questions")
public class QuizController {

    private final QuizService quizService;
    private final SubmissionService submissionService;

    public QuizController(QuizService quizService, SubmissionService submissionService) {
        this.quizService = quizService;
        this.submissionService = submissionService;
    }

    @GetMapping
    @Operation(summary = "Get quizzes with optional filtering by topic and ninja rank")
    public ResponseEntity<List<QuizDTO>> getQuizzes(
            @RequestParam(required = false) Long topicId,
            @RequestParam(required = false) NinjaRank rank) {
        return ResponseEntity.ok(quizService.getQuizzes(topicId, rank));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full quiz detail with questions for attempting an exam")
    public ResponseEntity<QuizDetailDTO> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "Start a quiz trial session and get server-enforced expiry timestamp")
    public ResponseEntity<QuizStartResponseDTO> startQuiz(
            @PathVariable Long id,
            Authentication authentication) {
        UUID userId = null;
        String username = null;
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserPrincipal p) {
                userId = p.getId();
            }
            username = authentication.getName();
        }
        return ResponseEntity.ok(submissionService.startQuizAttempt(id, userId, username));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get full quiz detail by unique slug")
    public ResponseEntity<QuizDetailDTO> getQuizBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(quizService.getQuizBySlug(slug));
    }
}

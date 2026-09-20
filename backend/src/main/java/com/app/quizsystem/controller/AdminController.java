package com.app.quizsystem.controller;

import com.app.quizsystem.dto.AdminOverrideDTO;
import com.app.quizsystem.dto.AdminQuizCreateDTO;
import com.app.quizsystem.dto.AiReviewDTO;
import com.app.quizsystem.dto.QuizDetailDTO;
import com.app.quizsystem.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@Tag(name = "Admin", description = "Endpoints for Quiz Builder and AI Grading Review management")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/quizzes")
    @Operation(summary = "Create a new quiz with custom questions and rubric under a topic")
    public ResponseEntity<QuizDetailDTO> createQuiz(@Valid @RequestBody AdminQuizCreateDTO request) {
        return ResponseEntity.ok(adminService.createQuiz(request));
    }

    @GetMapping("/reviews")
    @Operation(summary = "Get list of all AI-graded short answer submissions for review")
    public ResponseEntity<List<AiReviewDTO>> getAiGradingReviews() {
        return ResponseEntity.ok(adminService.getAiGradingReviews());
    }

    @PostMapping("/reviews/{answerId}/override")
    @Operation(summary = "Approve or override AI-assigned score for an answer")
    public ResponseEntity<AiReviewDTO> overrideAiGrade(
            @PathVariable Long answerId,
            @Valid @RequestBody AdminOverrideDTO overrideDTO) {
        return ResponseEntity.ok(adminService.overrideAiGrade(answerId, overrideDTO));
    }
}

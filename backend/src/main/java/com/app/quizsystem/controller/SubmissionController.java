package com.app.quizsystem.controller;

import com.app.quizsystem.dto.QuizStartResponseDTO;
import com.app.quizsystem.dto.SubmissionRequestDTO;
import com.app.quizsystem.dto.SubmissionResponseDTO;
import com.app.quizsystem.security.UserPrincipal;
import com.app.quizsystem.service.SubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
@Tag(name = "Submissions", description = "Endpoints for initiating trial timers, automated grading via Strategy Pattern & AI Sensei")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping("/start/{quizId}")
    @Operation(summary = "Initiate an exam trial session and receive a server-issued expiry timestamp")
    public ResponseEntity<QuizStartResponseDTO> startQuiz(
            @PathVariable Long quizId,
            Authentication authentication
    ) {
        UUID userId = null;
        String username = null;
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserPrincipal p) {
                userId = p.getId();
            }
            username = authentication.getName();
        }
        return ResponseEntity.ok(submissionService.startQuizAttempt(quizId, userId, username));
    }

    @PostMapping
    @Operation(summary = "Submit student exam answers for automated grading via Strategy Pattern & AI Sensei")
    public ResponseEntity<SubmissionResponseDTO> submitQuiz(
            @Valid @RequestBody SubmissionRequestDTO request,
            Authentication authentication
    ) {
        UUID userId = null;
        String username = null;
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserPrincipal p) {
                userId = p.getId();
            }
            username = authentication.getName();
        }
        SubmissionResponseDTO response = submissionService.processSubmission(request, userId, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get previous submission results by submission ID (restricted to submission owner or proctor admin)")
    public ResponseEntity<SubmissionResponseDTO> getSubmission(
            @PathVariable Long id,
            Authentication authentication
    ) {
        UUID userId = null;
        boolean isAdmin = false;
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserPrincipal p) {
                userId = p.getId();
            }
            isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));
        }
        return ResponseEntity.ok(submissionService.getSubmissionById(id, userId, isAdmin));
    }
}

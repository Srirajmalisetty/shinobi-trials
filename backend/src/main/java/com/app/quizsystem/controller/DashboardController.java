package com.app.quizsystem.controller;

import com.app.quizsystem.dto.DashboardStatsDTO;
import com.app.quizsystem.security.UserPrincipal;
import com.app.quizsystem.service.SubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
@Tag(name = "Dashboard", description = "Endpoints for fetching personalized shinobi trial stats, ranking history, and certificates")
public class DashboardController {

    private final SubmissionService submissionService;

    public DashboardController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @GetMapping({"", "/my"})
    @Operation(summary = "Get current authenticated shinobi dashboard statistics and certificates")
    public ResponseEntity<DashboardStatsDTO> getMyDashboard(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        if (authentication.getPrincipal() instanceof UserPrincipal principal) {
            return ResponseEntity.ok(submissionService.getDashboardStats(principal.getId()));
        }
        String username = authentication.getName();
        return ResponseEntity.ok(submissionService.getDashboardStats(username));
    }

    @GetMapping("/{username}")
    @Operation(summary = "Get dashboard statistics (restricted to own account or proctor admin)")
    public ResponseEntity<DashboardStatsDTO> getUserDashboard(@PathVariable String username, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));

        if (!isAdmin && !authentication.getName().equalsIgnoreCase(username)) {
            throw new AccessDeniedException("Access denied: You cannot view another shinobi's private trial record.");
        }

        return ResponseEntity.ok(submissionService.getDashboardStats(username));
    }
}

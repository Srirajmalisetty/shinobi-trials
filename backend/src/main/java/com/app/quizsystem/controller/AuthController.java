package com.app.quizsystem.controller;

import com.app.quizsystem.dto.AuthResponseDTO;
import com.app.quizsystem.dto.LoginRequestDTO;
import com.app.quizsystem.dto.RegisterRequestDTO;
import com.app.quizsystem.dto.UserDTO;
import com.app.quizsystem.security.UserPrincipal;
import com.app.quizsystem.service.AuthService;
import com.app.quizsystem.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "Endpoints for Shinobi candidate registration, login, and JWT verification")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new shinobi candidate")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO dto) {
        return ResponseEntity.ok(authService.register(dto));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate with username/email and password, returning a JWT token")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated shinobi profile and stats")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        if (authentication.getPrincipal() instanceof UserPrincipal principal) {
            return ResponseEntity.ok(userService.getCurrentUser(principal.getId()));
        }
        String username = authentication.getName();
        return ResponseEntity.ok(userService.getCurrentUser(username));
    }
}

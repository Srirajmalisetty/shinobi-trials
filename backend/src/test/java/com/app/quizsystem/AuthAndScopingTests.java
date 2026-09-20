package com.app.quizsystem;

import com.app.quizsystem.dto.AuthResponseDTO;
import com.app.quizsystem.dto.LoginRequestDTO;
import com.app.quizsystem.dto.RegisterRequestDTO;
import com.app.quizsystem.model.User;
import com.app.quizsystem.repository.UserRepository;
import com.app.quizsystem.security.JwtTokenProvider;
import com.app.quizsystem.security.PasswordEncoderConfig;
import com.app.quizsystem.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthAndScopingTests {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = Mockito.mock(UserRepository.class);
        passwordEncoder = new PasswordEncoderConfig().passwordEncoder();
        jwtTokenProvider = new JwtTokenProvider(
                "shinobiTrialsSuperSecretKeyForHmacSha256Authentication1234567890",
                86400000L
        );
        authService = new AuthService(userRepository, passwordEncoder, jwtTokenProvider);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequestDTO dto = new RegisterRequestDTO("boruto", "boruto@leaf.ninja", "Rasengan123!");

        when(userRepository.existsByUsername("boruto")).thenReturn(false);
        when(userRepository.existsByEmail("boruto@leaf.ninja")).thenReturn(false);

        UUID generatedId = UUID.randomUUID();
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(generatedId);
            return u;
        });

        AuthResponseDTO response = authService.register(dto);
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("boruto", response.getUser().getUsername());
        assertEquals("D", response.getUser().getRank());
        assertEquals(0, response.getUser().getXp());
        assertEquals("USER", response.getUser().getRole());

        // Verify JWT token carries the UUID and role
        assertTrue(jwtTokenProvider.validateToken(response.getToken()));
        assertEquals("boruto", jwtTokenProvider.getUsernameFromToken(response.getToken()));
        assertEquals("USER", jwtTokenProvider.getRoleFromToken(response.getToken()));
        assertEquals(generatedId, jwtTokenProvider.getUserIdFromToken(response.getToken()));
    }

    @Test
    void testRegisterRejectsDuplicateUsername() {
        RegisterRequestDTO dto = new RegisterRequestDTO("naruto", "naruto2@leaf.ninja", "Rasengan123!");
        when(userRepository.existsByUsername("naruto")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(dto));
    }

    @Test
    void testRegisterRejectsShortPassword() {
        RegisterRequestDTO dto = new RegisterRequestDTO("sarada", "sarada@leaf.ninja", "short");
        assertThrows(IllegalArgumentException.class, () -> authService.register(dto));
    }

    @Test
    void testLoginSuccess() {
        UUID userId = UUID.randomUUID();
        String hash = passwordEncoder.encode("Chidori123!");
        User user = User.builder()
                .id(userId)
                .username("sasuke")
                .email("sasuke@leaf.ninja")
                .passwordHash(hash)
                .role("USER")
                .rank("A")
                .xp(900)
                .createdAt(Instant.now())
                .build();

        when(userRepository.findByUsername("sasuke")).thenReturn(Optional.of(user));

        LoginRequestDTO loginDto = new LoginRequestDTO("sasuke", "Chidori123!");
        AuthResponseDTO response = authService.login(loginDto);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals(userId, jwtTokenProvider.getUserIdFromToken(response.getToken()));
        assertEquals("sasuke", jwtTokenProvider.getUsernameFromToken(response.getToken()));
    }

    @Test
    void testLoginFailureReturnsNonRevealingError() {
        when(userRepository.findByUsername("unknown_ninja")).thenReturn(Optional.empty());

        LoginRequestDTO loginDto = new LoginRequestDTO("unknown_ninja", "WrongPass123!");
        BadCredentialsException ex = assertThrows(BadCredentialsException.class, () -> authService.login(loginDto));
        assertEquals("Invalid credentials", ex.getMessage());
    }

    @Test
    void testJwtTokenProviderUUIDRoundTrip() {
        UUID randomId = UUID.randomUUID();
        String token = jwtTokenProvider.generateToken("kakashi", "ADMIN", randomId);

        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("kakashi", jwtTokenProvider.getUsernameFromToken(token));
        assertEquals("ADMIN", jwtTokenProvider.getRoleFromToken(token));
        assertEquals(randomId, jwtTokenProvider.getUserIdFromToken(token));
    }
}

package com.app.quizsystem.service;

import com.app.quizsystem.dto.AuthResponseDTO;
import com.app.quizsystem.dto.LoginRequestDTO;
import com.app.quizsystem.dto.RegisterRequestDTO;
import com.app.quizsystem.dto.UserDTO;
import com.app.quizsystem.model.User;
import com.app.quizsystem.repository.UserRepository;
import com.app.quizsystem.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO dto) {
        String username = dto.getUsername() != null ? dto.getUsername().trim() : "";
        String email = dto.getEmail() != null ? dto.getEmail().trim().toLowerCase() : "";
        String password = dto.getPassword() != null ? dto.getPassword() : "";

        if (username.length() < 3 || username.length() > 50) {
            throw new IllegalArgumentException("Username must be between 3 and 50 characters.");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Shinobi name '" + username + "' is already claimed in the Leaf Village.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email '" + email + "' is already registered in Academy records.");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role("USER")
                .rank("D")
                .xp(0)
                .build();

        User saved = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(saved.getUsername(), saved.getRole(), saved.getId());
        return new AuthResponseDTO(token, UserDTO.fromEntity(saved));
    }

    @Transactional
    public AuthResponseDTO login(LoginRequestDTO dto) {
        String identifier = dto.getUsername() != null ? dto.getUsername().trim() : "";
        String password = dto.getPassword() != null ? dto.getPassword() : "";

        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier.toLowerCase()))
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole(), user.getId());
        return new AuthResponseDTO(token, UserDTO.fromEntity(user));
    }
}

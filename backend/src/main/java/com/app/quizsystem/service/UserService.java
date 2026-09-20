package com.app.quizsystem.service;

import com.app.quizsystem.dto.UserDTO;
import com.app.quizsystem.model.User;
import com.app.quizsystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        return UserDTO.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User '" + username + "' not found."));
        return UserDTO.fromEntity(user);
    }

    @Transactional
    public void awardChakraRyo(UUID userId, int ryoEarned) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setXp(user.getXp() + ryoEarned);
            userRepository.save(user);
        });
    }

    @Transactional
    public void updateNinjaRank(UUID userId, String rank) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setRank(rank);
            userRepository.save(user);
        });
    }
}

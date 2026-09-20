package com.app.quizsystem.dto;

import com.app.quizsystem.model.User;
import java.time.Instant;
import java.util.UUID;

public class UserDTO {
    private UUID id;
    private String username;
    private String email;
    private String role;
    private String rank;
    private Integer xp;
    private Instant createdAt;
    private Instant updatedAt;

    public UserDTO() {}

    public UserDTO(UUID id, String username, String email, String role, String rank, Integer xp, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.rank = rank;
        this.xp = xp;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static UserDTO fromEntity(User user) {
        if (user == null) return null;
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getRank(),
                user.getXp(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getRank() { return rank; }
    public void setRank(String rank) { this.rank = rank; }
    public Integer getXp() { return xp; }
    public void setXp(Integer xp) { this.xp = xp; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    // Compatibility getters for frontend and existing service calls
    public String getNinjaRank() { return rank; }
    public void setNinjaRank(String ninjaRank) { this.rank = ninjaRank; }
    public Integer getChakraRyo() { return xp; }
    public void setChakraRyo(Integer chakraRyo) { this.xp = chakraRyo; }
}

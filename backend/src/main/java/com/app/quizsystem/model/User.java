package com.app.quizsystem.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, length = 20)
    private String role = "USER";

    @Column(length = 10)
    private String rank = "D";

    @Column(nullable = false)
    private Integer xp = 0;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public User() {}

    public User(UUID id, String username, String email, String passwordHash, String role, String rank, Integer xp, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role != null ? role : "USER";
        this.rank = rank != null ? rank : "D";
        this.xp = xp != null ? xp : 0;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

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

    // Backward-compatibility accessors
    public String getPassword() { return passwordHash; }
    public void setPassword(String password) { this.passwordHash = password; }
    public String getNinjaRank() { return rank; }
    public void setNinjaRank(String ninjaRank) { this.rank = ninjaRank; }
    public Integer getChakraRyo() { return xp; }
    public void setChakraRyo(Integer chakraRyo) { this.xp = chakraRyo; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private UUID id;
        private String username;
        private String email;
        private String passwordHash;
        private String role = "USER";
        private String rank = "D";
        private Integer xp = 0;
        private Instant createdAt = Instant.now();
        private Instant updatedAt = Instant.now();

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public Builder password(String password) { this.passwordHash = password; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder rank(String rank) { this.rank = rank; return this; }
        public Builder ninjaRank(String ninjaRank) { this.rank = ninjaRank; return this; }
        public Builder xp(Integer xp) { this.xp = xp; return this; }
        public Builder chakraRyo(Integer chakraRyo) { this.xp = chakraRyo; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public User build() {
            return new User(id, username, email, passwordHash, role, rank, xp, createdAt, updatedAt);
        }
    }
}

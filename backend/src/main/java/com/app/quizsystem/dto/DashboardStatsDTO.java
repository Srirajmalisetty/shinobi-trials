package com.app.quizsystem.dto;

import java.util.List;

public class DashboardStatsDTO {
    private UserDTO user;
    private Long totalAttempts;
    private Long passedTrials;
    private Double averageScore;
    private Integer totalChakraEarned;
    private List<SubmissionResponseDTO> recentSubmissions;
    private List<CertificateDTO> certificates;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(UserDTO user, Long totalAttempts, Long passedTrials, Double averageScore,
                             Integer totalChakraEarned, List<SubmissionResponseDTO> recentSubmissions,
                             List<CertificateDTO> certificates) {
        this.user = user;
        this.totalAttempts = totalAttempts;
        this.passedTrials = passedTrials;
        this.averageScore = averageScore;
        this.totalChakraEarned = totalChakraEarned;
        this.recentSubmissions = recentSubmissions;
        this.certificates = certificates;
    }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
    public Long getTotalAttempts() { return totalAttempts; }
    public void setTotalAttempts(Long totalAttempts) { this.totalAttempts = totalAttempts; }
    public Long getPassedTrials() { return passedTrials; }
    public void setPassedTrials(Long passedTrials) { this.passedTrials = passedTrials; }
    public Double getAverageScore() { return averageScore; }
    public void setAverageScore(Double averageScore) { this.averageScore = averageScore; }
    public Integer getTotalChakraEarned() { return totalChakraEarned; }
    public void setTotalChakraEarned(Integer totalChakraEarned) { this.totalChakraEarned = totalChakraEarned; }
    public List<SubmissionResponseDTO> getRecentSubmissions() { return recentSubmissions; }
    public void setRecentSubmissions(List<SubmissionResponseDTO> recentSubmissions) { this.recentSubmissions = recentSubmissions; }
    public List<CertificateDTO> getCertificates() { return certificates; }
    public void setCertificates(List<CertificateDTO> certificates) { this.certificates = certificates; }
}

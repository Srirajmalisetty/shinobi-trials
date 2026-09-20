package com.app.quizsystem.repository;

import com.app.quizsystem.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByCertificateCode(String certificateCode);
    Optional<Certificate> findByCertificateCodeAndUserId(String certificateCode, UUID userId);
    Optional<Certificate> findBySubmissionId(Long submissionId);
    Optional<Certificate> findBySubmissionIdAndUserId(Long submissionId, UUID userId);
    List<Certificate> findByUserIdOrderByIssuedAtDesc(UUID userId);
}

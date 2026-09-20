package com.app.quizsystem.service;

import com.app.quizsystem.dto.CertificateDTO;
import com.app.quizsystem.exception.ResourceNotFoundException;
import com.app.quizsystem.model.Certificate;
import com.app.quizsystem.model.Quiz;
import com.app.quizsystem.model.Submission;
import com.app.quizsystem.pdf.PdfGeneratorService;
import com.app.quizsystem.repository.CertificateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateService {

    private static final Logger log = LoggerFactory.getLogger(CertificateService.class);

    private final CertificateRepository certificateRepository;
    private final PdfGeneratorService pdfGeneratorService;

    @Value("${app.certificate.base-url:http://localhost:5173/certificates}")
    private String certificateBaseUrl;

    public CertificateService(CertificateRepository certificateRepository, PdfGeneratorService pdfGeneratorService) {
        this.certificateRepository = certificateRepository;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    @Transactional
    public Certificate createCertificate(Submission submission, Quiz quiz) {
        Optional<Certificate> existing = certificateRepository.findBySubmissionId(submission.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        String code = "SHINOBI-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String verificationUrl = certificateBaseUrl + "/" + code;

        String topicName = quiz.getTopic() != null ? quiz.getTopic().getName() : "Leaf Academy Jutsu";

        Certificate certificate = Certificate.builder()
                .submissionId(submission.getId())
                .userId(submission.getUserId())
                .certificateCode(code)
                .studentName(submission.getStudentName())
                .quizTitle(quiz.getTitle())
                .topicName(topicName)
                .ninjaRank(submission.getRankAwarded())
                .scorePercentage(submission.getPercentage())
                .issuedAt(Instant.now())
                .qrVerificationUrl(verificationUrl)
                .build();

        return certificateRepository.save(certificate);
    }

    @Transactional(readOnly = true)
    public CertificateDTO getCertificateByCode(String code, UUID currentUserId, boolean isAdmin) {
        Certificate cert = certificateRepository.findByCertificateCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found for code: " + code));

        if (!isAdmin && cert.getUserId() != null && currentUserId != null && !cert.getUserId().equals(currentUserId)) {
            throw new AccessDeniedException("Access denied: You cannot view another shinobi's certificate.");
        }

        return CertificateDTO.fromEntity(cert);
    }

    @Transactional(readOnly = true)
    public CertificateDTO verifyCertificatePublic(String code) {
        Certificate cert = certificateRepository.findByCertificateCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found for code: " + code));
        return CertificateDTO.fromEntity(cert);
    }

    @Transactional(readOnly = true)
    public byte[] getCertificatePdfBytes(String code, UUID currentUserId, boolean isAdmin) {
        Certificate cert = certificateRepository.findByCertificateCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found for code: " + code));

        if (!isAdmin && cert.getUserId() != null && currentUserId != null && !cert.getUserId().equals(currentUserId)) {
            throw new AccessDeniedException("Access denied: You cannot download another shinobi's certificate.");
        }

        return pdfGeneratorService.generateCertificatePdf(cert);
    }
}

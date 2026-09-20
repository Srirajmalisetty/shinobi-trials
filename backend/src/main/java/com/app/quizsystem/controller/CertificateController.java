package com.app.quizsystem.controller;

import com.app.quizsystem.dto.CertificateDTO;
import com.app.quizsystem.security.UserPrincipal;
import com.app.quizsystem.service.CertificateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "*")
@Tag(name = "Certificates", description = "Endpoints for previewing, downloading, and verifying shinobi rank certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @GetMapping("/{code}")
    @Operation(summary = "Get certificate metadata by unique certificate code (restricted to owner or admin)")
    public ResponseEntity<CertificateDTO> getCertificate(@PathVariable String code, Authentication authentication) {
        UUID userId = null;
        boolean isAdmin = false;
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserPrincipal p) {
                userId = p.getId();
            }
            isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));
        }
        return ResponseEntity.ok(certificateService.getCertificateByCode(code, userId, isAdmin));
    }

    @GetMapping("/{code}/verify")
    @Operation(summary = "Public verification endpoint returning certificate legitimacy status")
    public ResponseEntity<CertificateDTO> verifyCertificate(@PathVariable String code) {
        return ResponseEntity.ok(certificateService.verifyCertificatePublic(code));
    }

    @GetMapping(value = "/{code}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(summary = "Download official scroll certificate PDF rendered via Apache PDFBox (restricted to owner or admin)")
    public ResponseEntity<byte[]> downloadCertificatePdf(@PathVariable String code, Authentication authentication) {
        UUID userId = null;
        boolean isAdmin = false;
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof UserPrincipal p) {
                userId = p.getId();
            }
            isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));
        }
        byte[] pdfBytes = certificateService.getCertificatePdfBytes(code, userId, isAdmin);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(org.springframework.http.ContentDisposition.attachment()
                .filename("shinobi-certificate-" + code + ".pdf")
                .build());
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}

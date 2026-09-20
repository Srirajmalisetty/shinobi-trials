package com.app.quizsystem.pdf;

import com.app.quizsystem.model.Certificate;
import com.app.quizsystem.util.QrCodeGenerator;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class PdfGeneratorService {

    private static final Logger log = LoggerFactory.getLogger(PdfGeneratorService.class);

    private final QrCodeGenerator qrCodeGenerator;

    public PdfGeneratorService(QrCodeGenerator qrCodeGenerator) {
        this.qrCodeGenerator = qrCodeGenerator;
    }

    public byte[] generateCertificatePdf(Certificate cert) {
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDRectangle landscapeA4 = new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth());
            PDPage page = new PDPage(landscapeA4);
            document.addPage(page);

            float pageWidth = landscapeA4.getWidth();
            float pageHeight = landscapeA4.getHeight();

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {
                // Background dark shinobi canvas: #111125
                cs.setNonStrokingColor(new Color(17, 17, 37));
                cs.addRect(0, 0, pageWidth, pageHeight);
                cs.fill();

                // Inner parchment container: #1A1A2E
                float margin = 30f;
                cs.setNonStrokingColor(new Color(26, 26, 46));
                cs.addRect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
                cs.fill();

                // Gold double border: #FFC93C
                cs.setStrokingColor(new Color(255, 201, 60));
                cs.setLineWidth(2.5f);
                cs.addRect(margin + 6, margin + 6, pageWidth - 2 * (margin + 6), pageHeight - 2 * (margin + 6));
                cs.stroke();

                // Burnt Orange accent outer rim: #FF6B1A
                cs.setStrokingColor(new Color(255, 107, 26));
                cs.setLineWidth(1.0f);
                cs.addRect(margin + 12, margin + 12, pageWidth - 2 * (margin + 12), pageHeight - 2 * (margin + 12));
                cs.stroke();

                PDType1Font titleFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font bodyFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
                PDType1Font boldFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                PDType1Font italicFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE);

                // Leaf Village Header Banner
                cs.setNonStrokingColor(new Color(255, 107, 26));
                drawCenteredText(cs, boldFont, 13, "LEAF VILLAGE NINJA ACADEMY * GRAND SCROLL OF RECOGNITION", pageWidth, 515);

                // Title: CERTIFICATE OF RANK
                cs.setNonStrokingColor(new Color(255, 201, 60));
                drawCenteredText(cs, titleFont, 26, "OFFICIAL SHINOBI DIPLOMA", pageWidth, 475);

                cs.setNonStrokingColor(new Color(226, 224, 252));
                drawCenteredText(cs, italicFont, 12, "This imperial scroll testifies that the aspiring shinobi", pageWidth, 440);

                // Candidate Name
                cs.setNonStrokingColor(new Color(255, 181, 150));
                drawCenteredText(cs, boldFont, 24, cert.getStudentName().toUpperCase(), pageWidth, 405);

                // Trial Details
                cs.setNonStrokingColor(new Color(226, 224, 252));
                String descText = "has satisfactorily completed the rigorous trials of";
                drawCenteredText(cs, bodyFont, 12, descText, pageWidth, 370);

                cs.setNonStrokingColor(new Color(255, 255, 255));
                drawCenteredText(cs, boldFont, 16, cert.getQuizTitle(), pageWidth, 345);

                // Domain & Rank Promotion
                String domainRank = "Domain: " + cert.getTopicName() + "  |  Rank Attained: " +
                        (cert.getNinjaRank() != null ? cert.getNinjaRank().name() + "-Rank (" + cert.getNinjaRank().getTitle() + ")" : "Certified Shinobi");
                cs.setNonStrokingColor(new Color(126, 217, 158));
                drawCenteredText(cs, boldFont, 13, domainRank, pageWidth, 315);

                // Score banner
                cs.setNonStrokingColor(new Color(255, 201, 60));
                String scoreText = String.format("Chakra Mastery Score: %.1f%%", cert.getScorePercentage());
                drawCenteredText(cs, boldFont, 14, scoreText, pageWidth, 285);

                // Issue date and Seal ID
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy").withZone(ZoneId.of("UTC"));
                String dateStr = "Seal Imprinted: " + formatter.format(cert.getIssuedAt());
                cs.setNonStrokingColor(new Color(160, 160, 192));
                drawCenteredText(cs, italicFont, 10, dateStr, pageWidth, 255);

                String codeStr = "Registry Code: " + cert.getCertificateCode();
                drawCenteredText(cs, bodyFont, 9, codeStr, pageWidth, 235);

                // Signatures
                float leftSigX = 140f;
                float rightSigX = pageWidth - 260f;
                float sigY = 135f;

                cs.setStrokingColor(new Color(90, 65, 55));
                cs.setLineWidth(1.0f);
                cs.moveTo(leftSigX, sigY);
                cs.lineTo(leftSigX + 160, sigY);
                cs.stroke();

                cs.moveTo(rightSigX, sigY);
                cs.lineTo(rightSigX + 160, sigY);
                cs.stroke();

                cs.setNonStrokingColor(new Color(226, 224, 252));
                drawTextAt(cs, boldFont, 10, "Lord Seventh Hokage", leftSigX + 25, sigY - 14);
                drawTextAt(cs, italicFont, 8, "Leaf Village Supreme Commander", leftSigX + 12, sigY - 26);

                drawTextAt(cs, boldFont, 10, "Chunin Exam Master", rightSigX + 25, sigY - 14);
                drawTextAt(cs, italicFont, 8, "Official Shinobi Board", rightSigX + 32, sigY - 26);

                // QR Code
                try {
                    BufferedImage qrImage = qrCodeGenerator.generateQrCodeImage(cert.getQrVerificationUrl(), 100, 100);
                    PDImageXObject pdImage = LosslessFactory.createFromImage(document, qrImage);
                    float qrSize = 75f;
                    float qrX = (pageWidth - qrSize) / 2f;
                    float qrY = 100f;
                    cs.drawImage(pdImage, qrX, qrY, qrSize, qrSize);

                    cs.setNonStrokingColor(new Color(255, 201, 60));
                    drawCenteredText(cs, boldFont, 7, "SCAN TO VERIFY AUTHENTICITY", pageWidth, qrY - 10);
                } catch (Exception e) {
                    log.warn("Failed to render QR Code on certificate: {}", e.getMessage());
                }

                cs.setNonStrokingColor(new Color(120, 120, 150));
                drawCenteredText(cs, bodyFont, 7, "Authorized by the Grand Hidden Leaf Council * Shinobi Records Archive", pageWidth, 55);
            }

            document.save(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate certificate PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Could not generate certificate PDF", e);
        }
    }

    private void drawCenteredText(PDPageContentStream cs, PDType1Font font, float fontSize, String text, float pageWidth, float y) throws Exception {
        float textWidth = font.getStringWidth(text) / 1000 * fontSize;
        float x = (pageWidth - textWidth) / 2f;
        drawTextAt(cs, font, fontSize, text, x, y);
    }

    private void drawTextAt(PDPageContentStream cs, PDType1Font font, float fontSize, String text, float x, float y) throws Exception {
        cs.beginText();
        cs.setFont(font, fontSize);
        cs.newLineAtOffset(x, y);
        cs.showText(text);
        cs.endText();
    }
}

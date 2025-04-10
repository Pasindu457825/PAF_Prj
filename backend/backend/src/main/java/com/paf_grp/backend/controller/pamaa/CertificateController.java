package com.paf_grp.backend.controller.pamaa;

import com.paf_grp.backend.model.pamaa.Certificate;
import com.paf_grp.backend.service.pamaa.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/certificates")
public class CertificateController {
    
    @Autowired
    private CertificateService certificateService;
    
    // Get all certificates for a user
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Certificate>> getUserCertificates(@PathVariable String email) {
        List<Certificate> certificates = certificateService.getUserCertificates(email);
        return new ResponseEntity<>(certificates, HttpStatus.OK);
    }
    
    // Get a specific certificate
    @GetMapping("/{userEmail}/{courseId}")
    public ResponseEntity<Certificate> getCertificate(
            @PathVariable String userEmail, 
            @PathVariable Long courseId) {
        return certificateService.getCertificate(userEmail, courseId)
                .map(certificate -> new ResponseEntity<>(certificate, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Download a certificate as PDF
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable String id) { // Changed Long to String
        return certificateService.getCertificateById(id) // id is now String
                .map(certificate -> {
                    byte[] pdfBytes = certificateService.generateCertificatePdf(certificate.getId());
                    
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_PDF);
                    headers.setContentDispositionFormData("attachment", "certificate-" + id + ".pdf");
                    
                    return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
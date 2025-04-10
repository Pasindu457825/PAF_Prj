package com.paf_grp.backend.service.pamaa;

import com.paf_grp.backend.model.pamaa.Certificate;
import com.paf_grp.backend.repository.pamaa.CertificateRepository;
import com.paf_grp.backend.repository.pasindu.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateService {
    
    @Autowired
    private CertificateRepository certificateRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Generate a certificate for a completed course
    public Certificate generateCertificate(String userEmail, Long courseId, String courseTitle) {
        // Check if a certificate already exists
        Optional<Certificate> existingCertificate = certificateRepository.findByUserEmailAndCourseId(userEmail, courseId);
        
        if (existingCertificate.isPresent()) {
            return existingCertificate.get();
        }
        
        // Create a new certificate
        Certificate certificate = new Certificate(userEmail, courseId, courseTitle);
        
        // In a real application, you would generate a PDF certificate here
        // For this example, we'll just create a unique URL
        String certificateUrl = "/api/certificates/download/" + UUID.randomUUID().toString();
        certificate.setCertificateUrl(certificateUrl);
        
        return certificateRepository.save(certificate);
    }
    
    // Get all certificates for a user
    public List<Certificate> getUserCertificates(String userEmail) {
        return certificateRepository.findByUserEmail(userEmail);
    }
    
    // Get a specific certificate
    public Optional<Certificate> getCertificate(String userEmail, Long courseId) {
        return certificateRepository.findByUserEmailAndCourseId(userEmail, courseId);
    }
    
    // Get a certificate by ID
    public Optional<Certificate> getCertificateById(String id) {
        return certificateRepository.findById(id);
    }
    
    // Generate a PDF certificate (mock implementation)
    public byte[] generateCertificatePdf(String certificateId) {
        // In a real application, you would generate a PDF here
        // For this example, we'll just return a byte array with dummy content
        return "This is a certificate PDF".getBytes();
    }
}
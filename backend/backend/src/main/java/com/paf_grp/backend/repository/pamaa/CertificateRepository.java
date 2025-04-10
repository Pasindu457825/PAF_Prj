package com.paf_grp.backend.repository.pamaa;

import com.paf_grp.backend.model.pamaa.Certificate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends MongoRepository<Certificate, Long> {
    
    // Find certificates by user email
    List<Certificate> findByUserEmail(String userEmail);
    
    // Find certificate by user email and course ID
    Optional<Certificate> findByUserEmailAndCourseId(String userEmail, Long courseId);
}

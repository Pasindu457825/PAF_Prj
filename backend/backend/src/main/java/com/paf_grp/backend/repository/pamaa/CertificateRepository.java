package com.paf_grp.backend.repository.pamaa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf_grp.backend.model.pamaa.Certificate;
import com.paf_grp.backend.model.pamaa.Course;
import com.paf_grp.backend.model.pasindu.User;

@Repository
public interface CertificateRepository extends MongoRepository<Certificate, Long> {
    List<Certificate> findByUser(User user);
    Optional<Certificate> findByUserAndCourse(User user, Course course);
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
}

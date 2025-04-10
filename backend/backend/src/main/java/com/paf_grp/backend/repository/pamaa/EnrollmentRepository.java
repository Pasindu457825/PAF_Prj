package com.paf_grp.backend.repository.pamaa;

import com.paf_grp.backend.model.pamaa.Enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {
    
    // Find enrollments by user email
    List<Enrollment> findByUserEmail(String userEmail);
    
    // Find enrollments by course ID
    List<Enrollment> findByCourseId(String courseId);
    
    // Find enrollment by user email and course ID
    Optional<Enrollment> findByUserEmailAndCourseId(String userEmail, String courseId);
    
    // Find completed enrollments by user email
    List<Enrollment> findByUserEmailAndCompletedIsTrue(String userEmail);
}
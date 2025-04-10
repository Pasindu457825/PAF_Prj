package com.paf_grp.backend.repository.pamaa;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf_grp.backend.model.pamaa.Course;

@Repository
public interface CourseRepository extends MongoRepository<Course, Long> {
    
    // Find courses by creator email
    List<Course> findByCreatorEmail(String creatorEmail);
    
    // Find courses containing a specific title (for search functionality)
    List<Course> findByTitleContainingIgnoreCase(String title);
}

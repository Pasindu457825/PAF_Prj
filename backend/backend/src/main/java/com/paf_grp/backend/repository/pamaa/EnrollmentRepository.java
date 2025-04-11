package com.paf_grp.backend.repository.pamaa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf_grp.backend.model.pamaa.Enrollment;
import com.paf_grp.backend.model.pasindu.User;
import com.paf_grp.backend.model.pamaa.Course;


@Repository
public interface EnrollmentRepository extends MongoRepository<Enrollment, Long> {
    List<Enrollment> findByUser(User user);
    List<Enrollment> findByUserAndCompleted(User user, boolean completed);
    Optional<Enrollment> findByUserAndCourse(User user, Course course);
    int countByUser(User user);
    int countByUserAndCompleted(User user, boolean completed);
}

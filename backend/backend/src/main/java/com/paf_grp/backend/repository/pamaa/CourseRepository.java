package com.paf_grp.backend.repository.pamaa;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf_grp.backend.model.pasindu.User;
import com.paf_grp.backend.model.pamaa.Course;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByAuthor(User author);
    List<Course> findByTitleContainingIgnoreCase(String title);
}

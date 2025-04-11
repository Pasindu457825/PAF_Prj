package com.paf_grp.backend.repository.pamaa;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf_grp.backend.model.pamaa.Course;
import com.paf_grp.backend.model.pamaa.CourseUnit;

@Repository
public interface CourseUnitRepository extends MongoRepository<CourseUnit, Long> {
    List<CourseUnit> findByCourseOrderByOrderIndexAsc(Course course);
    int countByCourse(Course course);
}

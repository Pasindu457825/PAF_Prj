package com.paf_grp.backend.service.pamaa;

import com.paf_grp.backend.model.pamaa.Course;
import com.paf_grp.backend.model.pamaa.Stage;
import com.paf_grp.backend.repository.pamaa.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    // Create a new course
    public Course createCourse(Course course) {
        course.setCreatedAt(new Date());
        course.setUpdatedAt(new Date());
        return courseRepository.save(course);
    }
    
    // Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    // Get course by ID
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }
    
    // Get courses by creator email
    public List<Course> getCoursesByCreator(String creatorEmail) {
        return courseRepository.findByCreatorEmail(creatorEmail);
    }
    
    // Update a course
    public Course updateCourse(Long id, Course courseDetails) {
        Optional<Course> optionalCourse = courseRepository.findById(id);
        
        if (optionalCourse.isPresent()) {
            Course existingCourse = optionalCourse.get();
            
            // Only allow updates if the user is the creator
            if (!existingCourse.getCreatorEmail().equals(courseDetails.getCreatorEmail())) {
                throw new RuntimeException("You do not have permission to update this course");
            }
            
            existingCourse.setTitle(courseDetails.getTitle());
            existingCourse.setDescription(courseDetails.getDescription());
            existingCourse.setUpdatedAt(new Date());
            
            // Only update stages if they are provided
            if (courseDetails.getStages() != null && !courseDetails.getStages().isEmpty()) {
                existingCourse.setStages(courseDetails.getStages());
            }
            
            return courseRepository.save(existingCourse);
        } else {
            throw new RuntimeException("Course not found with id: " + id);
        }
    }
    
    // Add a stage to a course
    public Course addStage(Long courseId, Stage stage, String userEmail) {
        Optional<Course> optionalCourse = courseRepository.findById(courseId);
        
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            
            // Only allow updates if the user is the creator
            if (!course.getCreatorEmail().equals(userEmail)) {
                throw new RuntimeException("You do not have permission to update this course");
            }
            
            // Set the order of the new stage
            stage.setOrder(course.getStages().size());
            course.addStage(stage);
            course.setUpdatedAt(new Date());
            
            return courseRepository.save(course);
        } else {
            throw new RuntimeException("Course not found with id: " + courseId);
        }
    }
    
    // Delete a course
    public void deleteCourse(Long id, String userEmail) {
        Optional<Course> optionalCourse = courseRepository.findById(id);
        
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            
            // Only allow deletion if the user is the creator
            if (!course.getCreatorEmail().equals(userEmail)) {
                throw new RuntimeException("You do not have permission to delete this course");
            }
            
            courseRepository.deleteById(id);
        } else {
            throw new RuntimeException("Course not found with id: " + id);
        }
    }
    
    // Search courses by title
    public List<Course> searchCoursesByTitle(String title) {
        return courseRepository.findByTitleContainingIgnoreCase(title);
    }
}

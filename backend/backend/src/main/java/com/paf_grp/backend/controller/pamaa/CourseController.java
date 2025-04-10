package com.paf_grp.backend.controller.pamaa;

import com.paf_grp.backend.model.pamaa.Course;
import com.paf_grp.backend.model.pamaa.Stage;
import com.paf_grp.backend.service.pamaa.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/courses")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    // Create a new course
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
    }
    
    // Get all courses
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }
    
    // Get course by ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(course -> new ResponseEntity<>(course, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Get courses by creator
    @GetMapping("/creator/{email}")
    public ResponseEntity<List<Course>> getCoursesByCreator(@PathVariable String email) {
        List<Course> courses = courseService.getCoursesByCreator(email);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }
    
    // Update a course
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        try {
            Course updatedCourse = courseService.updateCourse(id, course);
            return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    
    // Add a stage to a course
    @PostMapping("/{id}/stages")
    public ResponseEntity<Course> addStage(@PathVariable Long id, @RequestBody Stage stage, @RequestParam String userEmail) {
        try {
            Course updatedCourse = courseService.addStage(id, stage, userEmail);
            return new ResponseEntity<>(updatedCourse, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    
    // Delete a course
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCourse(@PathVariable Long id, @RequestParam String userEmail) {
        try {
            courseService.deleteCourse(id, userEmail);
            return new ResponseEntity<>(Map.of("message", "Course deleted successfully"), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.FORBIDDEN);
        }
    }
    
    // Search courses by title
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String title) {
        List<Course> courses = courseService.searchCoursesByTitle(title);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }
}

package com.paf_grp.backend.controller.pamaa;

import com.paf_grp.backend.model.pamaa.Enrollment;
import com.paf_grp.backend.service.pamaa.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    // Enroll a user in a course
    @PostMapping
    public ResponseEntity<?> enrollUserInCourse(@RequestBody Map<String, String> enrollmentData) {
        try {
            String userEmail = enrollmentData.get("userEmail");
            Long courseId = Long.parseLong(enrollmentData.get("courseId"));
            
            Enrollment enrollment = enrollmentService.enrollUserInCourse(userEmail, courseId);
            return new ResponseEntity<>(enrollment, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all enrollments for a user
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Enrollment>> getUserEnrollments(@PathVariable String email) {
        List<Enrollment> enrollments = enrollmentService.getUserEnrollments(email);
        return new ResponseEntity<>(enrollments, HttpStatus.OK);
    }
    
    // Get all enrollments for a course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getCourseEnrollments(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentService.getCourseEnrollments(courseId);
        return new ResponseEntity<>(enrollments, HttpStatus.OK);
    }
    
    // Get a specific enrollment
    @GetMapping("/{userEmail}/{courseId}")
    public ResponseEntity<Enrollment> getEnrollment(
            @PathVariable String userEmail, 
            @PathVariable Long courseId) {
        return enrollmentService.getEnrollment(userEmail, courseId)
                .map(enrollment -> new ResponseEntity<>(enrollment, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    // Mark a stage as completed
    @PostMapping("/{userEmail}/{courseId}/complete/{stageOrder}")
    public ResponseEntity<?> completeStage(
            @PathVariable String userEmail, 
            @PathVariable Long courseId, 
            @PathVariable int stageOrder) {
        try {
            Enrollment updatedEnrollment = enrollmentService.completeStage(userEmail, courseId, stageOrder);
            return new ResponseEntity<>(updatedEnrollment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get progress percentage for a course
    @GetMapping("/{userEmail}/{courseId}/progress")
    public ResponseEntity<Map<String, Double>> getProgressPercentage(
            @PathVariable String userEmail, 
            @PathVariable Long courseId) {
        double progress = enrollmentService.getProgressPercentage(userEmail, courseId);
        return new ResponseEntity<>(Map.of("progress", progress), HttpStatus.OK);
    }
}

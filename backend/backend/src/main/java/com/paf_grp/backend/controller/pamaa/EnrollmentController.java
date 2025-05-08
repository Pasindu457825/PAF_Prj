package com.paf_grp.backend.controller.pamaa;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf_grp.backend.exception.BadRequestException;
import com.paf_grp.backend.exception.ResourceNotFoundException;
import com.paf_grp.backend.model.pamaa.Course;
import com.paf_grp.backend.model.pamaa.Enrollment;
import com.paf_grp.backend.model.pasindu.User;
import com.paf_grp.backend.repository.pamaa.CourseRepository;
import com.paf_grp.backend.repository.pamaa.CourseUnitRepository;
import com.paf_grp.backend.repository.pamaa.EnrollmentRepository;
import com.paf_grp.backend.repository.pasindu.UserRepository;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin("http://localhost:3000")
public class EnrollmentController {
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private CourseUnitRepository courseUnitRepository;
    
    // Enroll in a course
    @PostMapping
    public Enrollment enrollInCourse(@RequestBody Map<String, String> enrollmentRequest) {
        String userId = String.valueOf(enrollmentRequest.get("userId"));
        String courseId = enrollmentRequest.get("courseId");
        
        User user = userRepository.findById(String.valueOf(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        
        // Check if already enrolled
        if (enrollmentRepository.findByUserAndCourse(user, course).isPresent()) {
            throw new BadRequestException("You are already enrolled in this course");
        }
        
        Enrollment enrollment = new Enrollment(user, course);
        return enrollmentRepository.save(enrollment);
    }
    
    // Get enrollments for a user
    @GetMapping("/user/{userId}")
    public List<Enrollment> getUserEnrollments(@PathVariable String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        return enrollmentRepository.findByUser(user);
    }
    
    // Get completed enrollments for a user
    @GetMapping("/user/{userId}/completed")
    public List<Enrollment> getCompletedEnrollments(@PathVariable String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        return enrollmentRepository.findByUserAndCompleted(user, true);
    }
    
    // Get enrollment details
    @GetMapping("/{enrollmentId}")
    public Enrollment getEnrollment(@PathVariable String enrollmentId) {
        return enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));
    }
    
    // Update progress
    @PutMapping("/{enrollmentId}/progress")
    public Enrollment updateProgress(@PathVariable String enrollmentId, @RequestBody Map<String, Integer> progressUpdate) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + enrollmentId));
        
        int unitIndex = progressUpdate.get("unitIndex");
        
        // Get total units count
        int totalUnits = courseUnitRepository.countByCourse(enrollment.getCourse());
        System.out.println("total unitss: "+totalUnits);
        // Update progress
        enrollment.updateProgress(unitIndex, totalUnits);
        
        return enrollmentRepository.save(enrollment);
    }

//    unitIndex is the zero-based index of the unit the user just completed.
//    If the course has 4 units (0 to 3), and the user just completed the 2nd unit, send unitIndex: 1.




    // Get enrollment stats for a user
    // check this
    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getUserEnrollmentStats(@PathVariable String userId) {
        User user = userRepository.findById(String.valueOf(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        int totalEnrollments = enrollmentRepository.countByUser(user);
        int completedEnrollments = enrollmentRepository.countByUserAndCompleted(user, true);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEnrollments", totalEnrollments);
        stats.put("completedEnrollments", completedEnrollments);
        stats.put("inProgressEnrollments", totalEnrollments - completedEnrollments);
        
        return ResponseEntity.ok(stats);
    }
}

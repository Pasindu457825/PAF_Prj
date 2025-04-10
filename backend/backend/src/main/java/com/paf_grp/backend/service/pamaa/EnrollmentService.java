package com.paf_grp.backend.service.pamaa;

import com.paf_grp.backend.model.pamaa.Course;
import com.paf_grp.backend.model.pamaa.Enrollment;
import com.paf_grp.backend.repository.pamaa.CourseRepository;
import com.paf_grp.backend.repository.pamaa.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CertificateService certificateService;

    // Enroll a user in a course
    public Enrollment enrollUserInCourse(String userEmail, Long courseId) {
        // Check if course exists
        Optional<Course> optionalCourse = courseRepository.findById(courseId);
        if (optionalCourse.isEmpty()) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }

        // Check if user is already enrolled
        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByUserEmailAndCourseId(userEmail, courseId);
        if (existingEnrollment.isPresent()) {
            throw new RuntimeException("User is already enrolled in this course");
        }

        // Create a new enrollment
        Enrollment enrollment = new Enrollment(userEmail, courseId);
        return enrollmentRepository.save(enrollment);
    }

    // Get all enrollments for a user
    public List<Enrollment> getUserEnrollments(String userEmail) {
        return enrollmentRepository.findByUserEmail(userEmail);
    }

    // Get all enrollments for a course
    public List<Enrollment> getCourseEnrollments(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    // Get a specific enrollment
    public Optional<Enrollment> getEnrollment(String userEmail, Long courseId) {
        return enrollmentRepository.findByUserEmailAndCourseId(userEmail, courseId);
    }

    // Mark a stage as completed
    public Enrollment completeStage(String userEmail, Long courseId, int stageOrder) {
        Optional<Enrollment> optionalEnrollment = enrollmentRepository.findByUserEmailAndCourseId(userEmail, courseId);

        if (optionalEnrollment.isPresent()) {
            Enrollment enrollment = optionalEnrollment.get();

            // Add the stage to completed stages
            enrollment.completeStage(stageOrder);

            // Check if the course is completed
            Optional<Course> optionalCourse = courseRepository.findById(courseId);
            if (optionalCourse.isPresent()) {
                Course course = optionalCourse.get();

                // Check if all stages are completed
                if (enrollment.getCompletedStages().size() >= course.getStages().size()) {
                    enrollment.setCompleted(true);

                    // Generate a certificate
                    certificateService.generateCertificate(userEmail, courseId, course.getTitle());
                }
            }

            return enrollmentRepository.save(enrollment);
        } else {
            throw new RuntimeException("Enrollment not found for user: " + userEmail + " and course: " + courseId);
        }
    }

    // Get progress percentage for a course
    public double getProgressPercentage(String userEmail, Long courseId) {
        Optional<Enrollment> optionalEnrollment = enrollmentRepository.findByUserEmailAndCourseId(userEmail, courseId);
        Optional<Course> optionalCourse = courseRepository.findById(courseId);

        if (optionalEnrollment.isPresent() && optionalCourse.isPresent()) {
            Enrollment enrollment = optionalEnrollment.get();
            Course course = optionalCourse.get();

            if (course.getStages().isEmpty()) {
                return 0;
            }

            int completedStages = enrollment.getCompletedStages().size();
            int totalStages = course.getStages().size();

            return ((double) completedStages / totalStages) * 100;
        }

        return 0;
    }
}
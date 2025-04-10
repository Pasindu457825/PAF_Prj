package com.paf_grp.backend.model.pamaa;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "enrollments")
public class Enrollment {
    @Id
    private String id;

    private String userEmail;
    private String courseId;
    private Date enrolledAt;
    private Set<Integer> completedStages = new HashSet<>();
    private boolean completed;
    private Date completedAt;

    // Default constructor
    public Enrollment() {
        this.enrolledAt = new Date();
        this.completed = false;
    }

    // Constructor with fields
    public Enrollment(String userEmail, String courseId) {
        this.userEmail = userEmail;
        this.courseId = courseId;
        this.enrolledAt = new Date();
        this.completed = false;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public Date getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(Date enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public Set<Integer> getCompletedStages() {
        return completedStages;
    }

    public void setCompletedStages(Set<Integer> completedStages) {
        this.completedStages = completedStages;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
        if (completed) {
            this.completedAt = new Date();
        }
    }

    public Date getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Date completedAt) {
        this.completedAt = completedAt;
    }

    public void completeStage(int stageOrder) {
        this.completedStages.add(stageOrder);
    }
}
package com.paf_grp.backend.model.pamaa;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.paf_grp.backend.model.pasindu.User;

@Document(collection = "enrollments")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Enrollment {

    @Id
    private String id;

    @DBRef
    @JsonIdentityReference(alwaysAsId = false)
    private User user;

    @DBRef
    @JsonIdentityReference(alwaysAsId = false)
    private Course course;

    private LocalDateTime enrollmentDate;

    private int lastCompletedUnit = 0;

    private boolean completed = false;

    @DBRef
    private Certificate certificate;

    // Default constructor
    public Enrollment() {
        this.enrollmentDate = LocalDateTime.now();
    }

    // Parameterized constructor
    public Enrollment(User user, Course course) {
        this.user = user;
        this.course = course;
        this.enrollmentDate = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public LocalDateTime getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDateTime enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public int getLastCompletedUnit() {
        return lastCompletedUnit;
    }

    public void setLastCompletedUnit(int lastCompletedUnit) {
        this.lastCompletedUnit = lastCompletedUnit;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Certificate getCertificate() {
        return certificate;
    }

    public void setCertificate(Certificate certificate) {
        this.certificate = certificate;
    }

    // Helper method to update progress
    public void updateProgress(int unitIndex, int totalUnits) {
        if (unitIndex > lastCompletedUnit) {
            this.lastCompletedUnit = unitIndex;
        }

        if (lastCompletedUnit >= totalUnits - 1) {
            this.completed = true;
        }
    }
}

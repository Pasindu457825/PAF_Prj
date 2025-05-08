package com.paf_grp.backend.model.pamaa;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.paf_grp.backend.model.pasindu.User;

@Document(collection = "certificates")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Certificate {

    @Id
    private String id;

    @DBRef
    @JsonIdentityReference(alwaysAsId = false)
    private User user;

    @DBRef
    @JsonIdentityReference(alwaysAsId = false)
    private Course course;

    @DBRef
    @JsonIdentityReference(alwaysAsId = true)
    private Enrollment enrollment;

    private LocalDateTime issueDate;

    private String certificateNumber;

    // Default constructor
    public Certificate() {
        this.issueDate = LocalDateTime.now();
    }

    // Parameterized constructor
    public Certificate(User user, Course course, Enrollment enrollment, String certificateNumber) {
        this.user = user;
        this.course = course;
        this.enrollment = enrollment;
        this.certificateNumber = certificateNumber;
        this.issueDate = LocalDateTime.now();
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

    public Enrollment getEnrollment() {
        return enrollment;
    }

    public void setEnrollment(Enrollment enrollment) {
        this.enrollment = enrollment;
    }

    public LocalDateTime getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDateTime issueDate) {
        this.issueDate = issueDate;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }
}

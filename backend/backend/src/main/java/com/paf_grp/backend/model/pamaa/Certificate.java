package com.paf_grp.backend.model.pamaa;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "certificates")
public class Certificate {
    
    @Id
    private String id;
    private String userEmail;
    private String courseId;
    private String courseTitle;
    private Date issueDate;
    private String certificateUrl; // URL to the generated certificate PDF
    
    // Default constructor
    public Certificate() {
        this.issueDate = new Date();
    }
    
    // Constructor with fields
    public Certificate(String userEmail, String courseId, String courseTitle) {
        this.userEmail = userEmail;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.issueDate = new Date();
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
    
    public String getCourseTitle() {
        return courseTitle;
    }
    
    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }
    
    public Date getIssueDate() {
        return issueDate;
    }
    
    public void setIssueDate(Date issueDate) {
        this.issueDate = issueDate;
    }
    
    public String getCertificateUrl() {
        return certificateUrl;
    }
    
    public void setCertificateUrl(String certificateUrl) {
        this.certificateUrl = certificateUrl;
    }
}

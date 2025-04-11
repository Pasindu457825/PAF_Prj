package com.paf_grp.backend.model.pamaa;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.paf_grp.backend.model.pasindu.User;

@Document(collection = "courses")
public class Course {

    @Id
    private String id;

    private String title;

    private String description;

    private String category;

    private String pdfFileName;

    private String pdfFileUrl;

    @DBRef
    @JsonBackReference("user-courses")
    private User author;

    @DBRef
    @JsonManagedReference("course-units")
    private List<CourseUnit> units = new ArrayList<>();

    @DBRef
    @JsonIgnore
    private List<Enrollment> enrollments = new ArrayList<>();

    // Default constructor
    public Course() {
    }

    // Parameterized constructor
    public Course(String title, String description, User author) {
        this.title = title;
        this.description = description;
        this.author = author;
    }

    // Helper method to add a unit to this course
    public void addUnit(CourseUnit unit) {
        units.add(unit);
        unit.setCourse(this);
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPdfFileName() {
        return pdfFileName;
    }

    public void setPdfFileName(String pdfFileName) {
        this.pdfFileName = pdfFileName;
    }

    public String getPdfFileUrl() {
        return pdfFileUrl;
    }

    public void setPdfFileUrl(String pdfFileUrl) {
        this.pdfFileUrl = pdfFileUrl;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public List<CourseUnit> getUnits() {
        return units;
    }

    public void setUnits(List<CourseUnit> units) {
        this.units = units;
    }

    public List<Enrollment> getEnrollments() {
        return enrollments;
    }

    public void setEnrollments(List<Enrollment> enrollments) {
        this.enrollments = enrollments;
    }
}

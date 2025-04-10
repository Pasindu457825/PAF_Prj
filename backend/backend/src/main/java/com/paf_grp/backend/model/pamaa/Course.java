package com.paf_grp.backend.model.pamaa;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    private String title;
    private String description;
    private String creatorEmail;
    private Date createdAt;
    private Date updatedAt;
    private List<Stage> stages = new ArrayList<>();

    // Default constructor
    public Course() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Constructor with fields
    public Course(String title, String description, String creatorEmail) {
        this.title = title;
        this.description = description;
        this.creatorEmail = creatorEmail;
        this.createdAt = new Date();
        this.updatedAt = new Date();
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

    public String getCreatorEmail() {
        return creatorEmail;
    }

    public void setCreatorEmail(String creatorEmail) {
        this.creatorEmail = creatorEmail;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Stage> getStages() {
        return stages;
    }

    public void setStages(List<Stage> stages) {
        this.stages = stages;
    }

    public void addStage(Stage stage) {
        this.stages.add(stage);
    }
}
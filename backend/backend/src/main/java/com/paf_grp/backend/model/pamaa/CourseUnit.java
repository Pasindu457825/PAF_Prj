package com.paf_grp.backend.model.pamaa;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Document(collection = "course_units")
public class CourseUnit {

    @Id
    private String id;

    private String title;

    private String content;

    private int orderIndex;

    @DBRef
//    @JsonBackReference("course-units")
    @JsonIgnore
    private Course course;

    // Default constructor
    public CourseUnit() {
    }

    // Parameterized constructor
    public CourseUnit(String title, String content, int orderIndex) {
        this.id = new ObjectId().toString(); // Generate ID upfront
        this.title = title;
        this.content = content;
        this.orderIndex = orderIndex;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}

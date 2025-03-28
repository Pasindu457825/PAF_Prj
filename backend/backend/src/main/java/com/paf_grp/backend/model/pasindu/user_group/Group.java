package com.paf_grp.backend.model.pasindu.user_group;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "group")
public class Group {

    @Id
    private String id;

    private String name;
    private String description;

    private String createdBy; // ✅ Store creator's email

    private List<String> memberIds = new ArrayList<>(); // ✅ Store User IDs of group members

    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Group() {
    }

    public Group(String name, String description, String createdBy, List<String> memberIds) {
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.memberIds = memberIds;
        this.createdAt = LocalDateTime.now();
    }

    // Getters & Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public List<String> getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(List<String> memberIds) {
        this.memberIds = memberIds;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

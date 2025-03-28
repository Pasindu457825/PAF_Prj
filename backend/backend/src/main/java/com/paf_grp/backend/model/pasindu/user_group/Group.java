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
    private String createdBy; // ✅ Creator's email
    private List<String> memberIds = new ArrayList<>(); // ✅ Store member emails
    private boolean isPrivate = false; // ✅ NEW: Default to public
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Group() {
    }

    public Group(String name, String description, String createdBy, List<String> memberIds, boolean isPrivate) {
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.memberIds = memberIds;
        this.isPrivate = isPrivate;
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

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

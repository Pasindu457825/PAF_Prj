package com.paf_grp.backend.model.tharusha;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "post")
public class Post {

    @Id
    private String id;

    private String userId;          // who created the post
    private String description;     // text description
    private List<String> mediaUrls; // store image/video URLs from Firebase
    private List<String> hashtags;

    private Date createdAt;
    private Date updatedAt;

    // No-args constructor (required by Spring)
    public Post() {
    }

    // All-args constructor (optional but useful)
    public Post(String id, String userId, String description, List<String> mediaUrls,
                List<String> hashtags, Date createdAt, Date updatedAt) {
        this.id = id;
        this.userId = userId;
        this.description = description;
        this.mediaUrls = mediaUrls;
        this.hashtags = hashtags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters & Setters for all fields

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public List<String> getHashtags() {
        return hashtags;
    }

    public void setHashtags(List<String> hashtags) {
        this.hashtags = hashtags;
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
}

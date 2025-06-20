package com.paf_grp.backend.model.isuri;

import java.util.Date;

public class Comment {
    private String id;
    private String userId;
    private String commentText;
    private Date createdAt;

    public Comment(String id, String userId, String commentText, Date createdAt) {
        this.id = id;
        this.userId = userId;
        this.commentText = commentText;
        this.createdAt = createdAt;
    }

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

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}


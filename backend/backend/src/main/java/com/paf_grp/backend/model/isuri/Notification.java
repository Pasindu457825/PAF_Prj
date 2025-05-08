package com.paf_grp.backend.model.isuri;

import java.util.Date;

public class Notification {
    private String id;
    private String recipientEmail; // Who receives the notification
    private String senderEmail;    // Who triggered the notification
    private String postId;         // Relevant post
    private String type;           // "like" or "comment"
    private String message;        // Pre-formatted message
    private Date createdAt;
    private boolean isRead;

    // Constructors, getters, and setters
    public Notification() {
    }

    public Notification(String recipientEmail, String senderEmail,
                        String postId, String type, String message) {
        this.recipientEmail = recipientEmail;
        this.senderEmail = senderEmail;
        this.postId = postId;
        this.type = type;
        this.message = message;
        this.createdAt = new Date();
        this.isRead = false;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }
 }

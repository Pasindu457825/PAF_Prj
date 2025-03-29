package com.paf_grp.backend.model.pasindu.user_message;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    private String groupId;
    private String groupName;
    private String senderEmail;
    private String senderName; // ✅ NEW FIELD for display
    private String content;
    private String Image;
    private LocalDateTime timestamp = LocalDateTime.now();

    public Message() {
    }

    public Message(String groupId, String senderEmail, String senderName, String content, String Image) {
        this.groupId = groupId;
        this.senderEmail = senderEmail;
        this.senderName = senderName;
        this.content = content;
        this.Image = Image;
    }

    // Getters & Setters
    public String getId() {
        return id;
    }

    public String getGroupId() {
        return groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getContent() {
        return content;
    }

    public String getImage() {
        return Image;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setImage(String image) {
        this.Image = image;
    }


    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}

package com.paf_grp.backend.model.tharusha;

import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

public class Post {

    @Id
    private String id;

    private String userId;          // who created the post
    private String description;     // text description
    private List<String> mediaUrls; // store image/video URLs from Firebase
    private List<String> hashtags;

    private Date createdAt;
    private Date updatedAt;
}

package com.paf_grp.backend.model.pamaa;

public class Stage {
    
    private String title;
    private String content;
    private int order;
    
    // Default constructor
    public Stage() {
    }
    
    // Constructor with fields
    public Stage(String title, String content, int order) {
        this.title = title;
        this.content = content;
        this.order = order;
    }
    
    // Getters and Setters
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
    
    public int getOrder() {
        return order;
    }
    
    public void setOrder(int order) {
        this.order = order;
    }
}

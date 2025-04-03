package com.paf_grp.backend.model.pasindu.user_group;

public class GroupRequest {
    private String name;
    private String description;
    private String creatorEmail;
    private boolean isPrivate;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCreatorEmail() { return creatorEmail; }
    public void setCreatorEmail(String creatorEmail) { this.creatorEmail = creatorEmail; }

    public boolean getIsPrivate() { return isPrivate; } // ✅
    public void setIsPrivate(boolean isPrivate) { this.isPrivate = isPrivate; } // ✅
}


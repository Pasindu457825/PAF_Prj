package com.paf_grp.backend.controller.pasindu.user_group;

import com.paf_grp.backend.model.pasindu.user_group.Group;
import com.paf_grp.backend.service.pasindu.GroupService;
import com.paf_grp.backend.model.pasindu.user_group.GroupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    // ✅ Create Group
    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody GroupRequest request) {
        if (request.getName() == null || request.getCreatorEmail() == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        Group newGroup = groupService.createGroup(
                request.getName(),
                request.getDescription(),
                request.getCreatorEmail()
        );
        return ResponseEntity.ok(newGroup);
    }


    // ✅ Get All Groups
    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    // ✅ Get Group by ID
    @GetMapping("/{id}")
    public Group getGroupById(@PathVariable String id) {
        return groupService.getGroupById(id);
    }

    // ✅ Add Member to Group
    @PostMapping("/{groupId}/add-member")
    public Group addMember(
            @PathVariable String groupId,
            @RequestParam String userId,
            @RequestParam String actingUserEmail
    ) {
        return groupService.addMember(groupId, userId, actingUserEmail);
    }

    // ✅ Remove Member from Group
    @DeleteMapping("/{groupId}/remove-member")
    public Group removeMember(
            @PathVariable String groupId,
            @RequestParam String userId,
            @RequestParam String actingUserEmail
    ) {
        return groupService.removeMember(groupId, userId, actingUserEmail);
    }


    // ✅ Get All Groups for a User
    @GetMapping("/user/{userId}")
    public List<Group> getGroupsByUserId(@PathVariable String userId) {
        return groupService.getGroupsByUserId(userId);
    }


    // ✅ Delete Group
    @DeleteMapping("/delete/{id}")
    public String deleteGroup(@PathVariable String id) {
        groupService.deleteGroup(id);
        return "Group with ID " + id + " has been deleted.";
    }
}

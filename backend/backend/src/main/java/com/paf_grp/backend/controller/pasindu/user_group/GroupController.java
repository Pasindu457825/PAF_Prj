package com.paf_grp.backend.controller.pasindu.user_group;

import com.paf_grp.backend.model.pasindu.user_group.Group;
import com.paf_grp.backend.model.pasindu.user_group.GroupRequest;
import com.paf_grp.backend.service.pasindu.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    // ✅ Create Group (calls service method)
    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody GroupRequest request) {
        if (request.getName() == null || request.getCreatorEmail() == null) {
            return ResponseEntity.badRequest().build();
        }

        Group newGroup = groupService.createGroup(
                request.getName(),
                request.getDescription(),
                request.getCreatorEmail(),
                request.getIsPrivate() // ✅ Pass privacy option
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

    // ✅ Get Groups for User
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

    @PostMapping("/{groupId}/join")
    public ResponseEntity<Group> joinPublicGroup(
            @PathVariable String groupId,
            @RequestParam String userEmail
    ) {
        try {
            Group updatedGroup = groupService.joinPublicGroup(groupId, userEmail);
            return ResponseEntity.ok(updatedGroup);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{groupId}/request")
    public ResponseEntity<Group> requestToJoinPrivateGroup(
            @PathVariable String groupId,
            @RequestParam String userEmail
    ) {
        try {
            Group updatedGroup = groupService.requestToJoinPrivateGroup(groupId, userEmail);
            return ResponseEntity.ok(updatedGroup);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/admin/{adminEmail}/pending-requests")
    public List<Group> getPendingJoinRequestsForAdmin(@PathVariable String adminEmail) {
        return groupService.getGroupsWithPendingRequests(adminEmail);
    }

}

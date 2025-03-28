package com.paf_grp.backend.service.pasindu;

import com.paf_grp.backend.model.pasindu.user_group.Group;
import com.paf_grp.backend.model.pasindu.User;
import com.paf_grp.backend.repository.pasindu.GroupRepository;
import com.paf_grp.backend.repository.pasindu.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Create a group
    public Group createGroup(String name, String description, String creatorEmail, boolean isPrivate) {
        User creator = userRepository.findByEmailIgnoreCase(creatorEmail);
        if (creator == null) {
            throw new RuntimeException("Creator not found");
        }

        Group group = new Group();
        group.setName(name);
        group.setDescription(description);
        group.setCreatedBy(creator.getEmail());
        group.setPrivate(isPrivate); // ✅ new field
        group.getMemberIds().add(creator.getEmail()); // add creator as first member

        return groupRepository.save(group);
    }





    // ✅ Add a member to the group
    public Group addMember(String groupId, String userId, String actingUserEmail) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!group.getCreatedBy().equalsIgnoreCase(actingUserEmail)) {
            throw new RuntimeException("Only the group creator can add members");
        }

        User userToAdd = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String userEmail = userToAdd.getEmail();

        if (!group.getMemberIds().contains(userEmail)) {
            group.getMemberIds().add(userEmail);
        }


        return groupRepository.save(group);
    }

    // ✅ Remove a member from the group
    public Group removeMember(String groupId, String userId, String actingUserEmail) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!group.getCreatedBy().equalsIgnoreCase(actingUserEmail)) {
            throw new RuntimeException("Only the group creator can remove members");
        }

        group.getMemberIds().remove(userId);
        return groupRepository.save(group);
    }

    // ✅ Get all groups
    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    // ✅ Get all groups by user ID (user is a member)
    public List<Group> getGroupsByUserId(String userId) {
        return groupRepository.findAll().stream()
                .filter(group -> group.getMemberIds().contains(userId))
                .toList();
    }

    // ✅ Get group by ID
    public Group getGroupById(String id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with ID: " + id));
    }

    // ✅ Delete group by ID
    public void deleteGroup(String id) {
        groupRepository.deleteById(id);
    }

    public Group joinPublicGroup(String groupId, String userEmail) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (group.isPrivate()) {
            throw new RuntimeException("Cannot join a private group directly.");
        }

        if (!group.getMemberIds().contains(userEmail)) {
            group.getMemberIds().add(userEmail);
        }

        return groupRepository.save(group);
    }

    public Group requestToJoinPrivateGroup(String groupId, String userEmail) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!group.isPrivate()) {
            throw new RuntimeException("Group is public. No need to request.");
        }

        if (group.getMemberIds().contains(userEmail)) {
            throw new RuntimeException("User is already a member.");
        }

        if (!group.getPendingRequests().contains(userEmail)) {
            group.getPendingRequests().add(userEmail);
        }

        // TODO: Notify the admin (group.getCreatedBy()) - email or dashboard notification

        return groupRepository.save(group);
    }

    public List<Group> getGroupsWithPendingRequests(String adminEmail) {
        return groupRepository.findAll().stream()
                .filter(group -> group.getCreatedBy().equalsIgnoreCase(adminEmail))
                .filter(group -> group.getPendingRequests() != null && !group.getPendingRequests().isEmpty())
                .toList();
    }

    // Approve Request
    public Group approveJoinRequest(String groupId, String userEmail, String adminEmail) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!group.getCreatedBy().equalsIgnoreCase(adminEmail)) {
            throw new RuntimeException("Only the group creator can approve requests.");
        }

        if (group.getPendingRequests().contains(userEmail)) {
            group.getPendingRequests().remove(userEmail);
            if (!group.getMemberIds().contains(userEmail)) {
                group.getMemberIds().add(userEmail);
            }
        }

        return groupRepository.save(group);
    }

    // Reject Request
    public Group rejectJoinRequest(String groupId, String userEmail, String adminEmail) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!group.getCreatedBy().equalsIgnoreCase(adminEmail)) {
            throw new RuntimeException("Only the group creator can reject requests.");
        }

        group.getPendingRequests().remove(userEmail);

        return groupRepository.save(group);
    }


}

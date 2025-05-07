package com.paf_grp.backend.controller.pasindu;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.paf_grp.backend.model.isuri.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.paf_grp.backend.model.pasindu.User;
import com.paf_grp.backend.repository.isuri.NotificationRepository;
import com.paf_grp.backend.repository.pasindu.UserRepository;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ Create User (with password hashing)
    @PostMapping
    public User createUser(@RequestBody User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    // ✅ Get All Users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Update User (excluding password by default)
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(updatedUser.getEmail());
            user.setUsername(updatedUser.getUsername());
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    // ✅ Delete User
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return "User with ID " + id + " has been deleted.";
    }

    // ✅ Get Followed Users
    @GetMapping("/{id}/followed")
    public List<String> getFollowedUsers(@PathVariable String id) {
        return userRepository.findById(id)
                .map(User::getFollowedUsers)
                .orElse(new ArrayList<>());
    }

    // ✅ Follow a User
    @PostMapping("/{id}/follow")
    public Map<String, String> followUser(@PathVariable String id, @RequestBody Map<String, String> request) {
        String followUserId = request.get("followUserId");
        return userRepository.findById(id).map(user -> {
            List<String> followedUsers = user.getFollowedUsers();
            if (!followedUsers.contains(followUserId)) {
                followedUsers.add(followUserId);
                user.setFollowedUsers(followedUsers);
                userRepository.save(user);

                // Create and save a notification
                userRepository.findById(followUserId).ifPresent(followedUser -> {
                    Notification notification = new Notification(
                            followedUser.getEmail(),
                            user.getEmail(),
                            null, // No postId for follow action
                            "follow",
                            user.getUsername() + " followed you."
                    );
                    notificationRepository.save(notification);
                });
            }
            Map<String, String> response = new HashMap<>();
            response.put("message", "User followed successfully.");
            return response;
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    // ✅ Unfollow a User
    @PostMapping("/{id}/unfollow")
    public Map<String, String> unfollowUser(@PathVariable String id, @RequestBody Map<String, String> request) {
        String unfollowUserId = request.get("unfollowUserId");
        return userRepository.findById(id).map(user -> {
            List<String> followedUsers = user.getFollowedUsers();
            if (followedUsers.contains(unfollowUserId)) {
                followedUsers.remove(unfollowUserId);
                user.setFollowedUsers(followedUsers);
                userRepository.save(user);
            }
            Map<String, String> response = new HashMap<>();
            response.put("message", "User unfollowed successfully.");
            return response;
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    // ✅ Get User Details by IDs
    @PostMapping("/details")
    public List<User> getUsersByIds(@RequestBody List<String> userIds) {
        return userRepository.findAllById(userIds);
    }
}

package com.paf_grp.backend.controller.tharusha;

import com.paf_grp.backend.model.isuri.Notification;
import com.paf_grp.backend.model.tharusha.Post;
import com.paf_grp.backend.repository.isuri.NotificationRepository;
import com.paf_grp.backend.repository.tharusha.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.paf_grp.backend.model.isuri.Comment;

import java.util.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;

    @Autowired
    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Typically, authentication.getName() returns the email or username.
        String userEmail = authentication.getName();
        post.setUserId(userEmail);

        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        Post savedPost = postRepository.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable String id) {
        return postRepository.findById(id)
                .map(post -> ResponseEntity.ok(post))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // ADD THIS NEW ENDPOINT
    @GetMapping("/user/{email}")
    public List<Post> getPostsByUser(@PathVariable String email) {
        return postRepository.findByUserId(email);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // PostController.java
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String id,
            @RequestBody Post updatedData
    ) {
        return postRepository.findById(id).map(existing -> {
            // Overwrite fields
            existing.setDescription(updatedData.getDescription());
            existing.setHashtags(updatedData.getHashtags());
            existing.setMediaUrls(updatedData.getMediaUrls()); // replaced entirely

            existing.setUpdatedAt(new Date());
            Post saved = postRepository.save(existing);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Post> toggleLike(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getName();
        return postRepository.findById(id).map(post -> {
            if (post.getLikes().contains(userId)) {
                post.getLikes().remove(userId);
            } else {
                post.getLikes().add(userId);
                createLikeNotification(id, userId); // Add notification
            }
            Post updatedPost = postRepository.save(post);
            return ResponseEntity.ok(updatedPost);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Post> addComment(
            @PathVariable String id,
            @RequestBody Comment comment,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        comment.setUserId(userId);
        comment.setCreatedAt(new Date());
        comment.setId(String.valueOf(System.currentTimeMillis()));

        return postRepository.findById(id).map(post -> {
            if (post.getComments() == null) {
                post.setComments(new ArrayList<>());
            }
            post.getComments().add(comment);
            createCommentNotification(id, userId); // Add notification
            Post updatedPost = postRepository.save(post);
            return ResponseEntity.ok(updatedPost);
        }).orElse(ResponseEntity.notFound().build());
    }


    @Autowired
    private NotificationRepository notificationRepository;

    private void createLikeNotification(String postId, String likerEmail) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post != null) {
            String message = likerEmail + " liked your post";
            Notification notification = new Notification(
                    post.getUserId(),
                    likerEmail,
                    postId,
                    "like",
                    message
            );
            notificationRepository.save(notification);
        }
    }

    private void createCommentNotification(String postId, String commenterEmail) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post != null) {
            String message = commenterEmail + " commented on your post";
            Notification notification = new Notification(
                    post.getUserId(),
                    commenterEmail,
                    postId,
                    "comment",
                    message
            );
            notificationRepository.save(notification);
        }
    }
}

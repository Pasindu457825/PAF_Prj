package com.paf_grp.backend.controller.tharusha;

import com.paf_grp.backend.model.isuri.Comment;
import com.paf_grp.backend.model.isuri.Notification;
import com.paf_grp.backend.model.tharusha.Post;
import com.paf_grp.backend.repository.isuri.NotificationRepository;
import com.paf_grp.backend.repository.tharusha.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PostController {

    private final PostRepository postRepository;

    @Autowired
    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // ✅ Create post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        post.setUserId(userEmail);
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());

        Post savedPost = postRepository.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    // ✅ Get single post
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable String id) {
        return postRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // ✅ Get posts by user email
    @GetMapping("/user/{email}")
    public List<Post> getPostsByUser(@PathVariable String email) {
        return postRepository.findByUserId(email);
    }

    // ✅ Delete post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ Update post
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post updatedData) {
        return postRepository.findById(id).map(existing -> {
            existing.setDescription(updatedData.getDescription());
            existing.setHashtags(updatedData.getHashtags());
            existing.setMediaUrls(updatedData.getMediaUrls());
            existing.setUpdatedAt(new Date());

            Post saved = postRepository.save(existing);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
    // ✅ Delete comment from post
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteCommentFromPost(@PathVariable String postId, @PathVariable String commentId) {
        return postRepository.findById(postId).map(post -> {
            List<Comment> comments = post.getComments();
            if (comments == null || comments.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No comments to delete");
            }

            boolean removed = comments.removeIf(c -> c.getId().equals(commentId));
            if (!removed) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");
            }

            post.setComments(comments);
            postRepository.save(post);
            return ResponseEntity.ok("Comment deleted");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found"));
    }

    //Edit comment
    @PutMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestBody Comment updatedComment
    ) {
        return postRepository.findById(postId).map(post -> {
            List<Comment> comments = post.getComments();
            if (comments == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No comments found");

            for (Comment c : comments) {
                if (c.getId().equals(commentId)) {
                    c.setCommentText(updatedComment.getCommentText());
                    break;
                }
            }

            postRepository.save(post);
            return ResponseEntity.ok("Comment updated");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found"));
    }
    // ✅ Toggle like
    @PostMapping("/{id}/like")
    public ResponseEntity<Post> toggleLike(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getName();
        return postRepository.findById(id).map(post -> {
            if (post.getLikes().contains(userId)) {
                post.getLikes().remove(userId);
            } else {
                post.getLikes().add(userId);
                createLikeNotification(id, userId);
            }
            Post updatedPost = postRepository.save(post);
            return ResponseEntity.ok(updatedPost);
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Add comment
    @PostMapping("/{id}/comments")
    public ResponseEntity<Post> addComment(
            @PathVariable String id,
            @RequestBody Comment comment,
            Authentication authentication
    ) {
        String userId = authentication.getName();
        comment.setUserId(userId);
        comment.setCreatedAt(new Date());

        // Ensure unique comment ID
        comment.setId(UUID.randomUUID().toString());

        return postRepository.findById(id).map(post -> {
            if (post.getComments() == null) {
                post.setComments(new ArrayList<>());
            }
            post.getComments().add(comment);
            createCommentNotification(id, userId);
            Post updatedPost = postRepository.save(post);
            return ResponseEntity.ok(updatedPost);
        }).orElse(ResponseEntity.notFound().build());
    }

    // ============================
    // 🔔 Notification Handlers
    // ============================

    @Autowired
    private NotificationRepository notificationRepository;

    private void createLikeNotification(String postId, String likerEmail) {
        postRepository.findById(postId).ifPresent(post -> {
            String message = likerEmail + " liked your post";
            Notification notification = new Notification(
                    post.getUserId(), likerEmail, postId, "like", message
            );
            notificationRepository.save(notification);
        });
    }

    private void createCommentNotification(String postId, String commenterEmail) {
        postRepository.findById(postId).ifPresent(post -> {
            String message = commenterEmail + " commented on your post";
            Notification notification = new Notification(
                    post.getUserId(), commenterEmail, postId, "comment", message
            );
            notificationRepository.save(notification);
        });
    }
}

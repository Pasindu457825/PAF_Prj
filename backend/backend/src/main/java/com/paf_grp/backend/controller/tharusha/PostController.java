package com.paf_grp.backend.controller.tharusha;

import com.paf_grp.backend.model.tharusha.Post;
import com.paf_grp.backend.repository.tharusha.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

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


}

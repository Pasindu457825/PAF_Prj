package com.paf_grp.backend.controller.isuri;

import com.paf_grp.backend.model.isuri.Comment;
import com.paf_grp.backend.repository.isuri.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    // ✅ Get all comments (if needed for admin or testing)
    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        return ResponseEntity.ok(commentRepository.findAll());
    }

    // ✅ Get single comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable String id) {
        Optional<Comment> comment = commentRepository.findById(id);
        return comment.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // ✅ Add new comment (used when decoupled from post)
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Comment comment) {
        comment.setCreatedAt(new Date());
        Comment saved = commentRepository.save(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ✅ Update a comment by ID
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable String id, @RequestBody Comment updatedComment) {
        Optional<Comment> optionalComment = commentRepository.findById(id);
        if (optionalComment.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");
        }

        Comment existing = optionalComment.get();
        existing.setCommentText(updatedComment.getCommentText());
        commentRepository.save(existing);

        return ResponseEntity.ok("Comment updated successfully");
    }

    // ✅ Delete a comment by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        System.out.println("Attempting to delete comment with ID: " + id);
        if (!commentRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");
        }

        commentRepository.deleteById(id);
        return ResponseEntity.ok("Comment deleted successfully");
    }
}

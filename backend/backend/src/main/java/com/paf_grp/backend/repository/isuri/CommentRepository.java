package com.paf_grp.backend.repository.isuri;

import com.paf_grp.backend.model.isuri.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String> {
}

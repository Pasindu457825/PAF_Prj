package com.paf_grp.backend.repository.tharusha;

import com.paf_grp.backend.model.tharusha.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    // By extending MongoRepository<Post, String>,
    // you get all the basic CRUD methods, such as:
    //   - save(Post post)
    //   - findById(String id)
    //   - findAll()
    //   - deleteById(String id)
    //   - etc.

    // You can also add custom query methods if needed, for example:
    List<Post> findByUserId(String userId);

    // Or if you want to query by a single hashtag in the array:
    List<Post> findByHashtags(String hashtag);

    // If you need more complex queries, you can use
    // Spring Data MongoDB’s @Query annotation, for example:
    // @Query("{ 'hashtags': { $in: [?0] } }")
    // List<Post> findByHashtagsContaining(String hashtag);
}

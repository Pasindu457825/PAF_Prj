package com.paf_grp.backend.repository.pasindu;

import com.paf_grp.backend.model.pasindu.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

    // ✅ Add this line:
    User findByUsername(String username);
    boolean existsByEmail(String email);  // ✅ Add this line
}

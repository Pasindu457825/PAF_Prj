package com.paf_grp.backend.repository.pasindu;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.paf_grp.backend.model.pasindu.User;

public interface UserRepository extends MongoRepository<User, String> {

    User findByUsername(String username);
    
    boolean existsByEmail(String email);

    // Add this line to find user by email
    User findByEmail(String email);  // New method to find user by email
}

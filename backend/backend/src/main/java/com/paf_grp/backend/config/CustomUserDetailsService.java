package com.paf_grp.backend.config;

import com.paf_grp.backend.model.pasindu.User;  // adjust if your User is in a different package
import com.paf_grp.backend.repository.pasindu.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Collections;

@Configuration
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1) Find the user by email in MongoDB
        User user = userRepository.findByEmailIgnoreCase(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        // 2) Return a Spring Security `User` object
        //    Use the hashed password from the DB, plus any roles/authorities
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),            // principal (username)
                user.getPassword(),         // hashed password
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}

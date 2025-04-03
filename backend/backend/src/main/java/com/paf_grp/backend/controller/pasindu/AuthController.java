package com.paf_grp.backend.controller.pasindu;

import com.paf_grp.backend.model.pasindu.User;
import com.paf_grp.backend.repository.pasindu.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest, HttpServletRequest request) {
        // 1) Find user by email
        User user = userRepository.findByEmailIgnoreCase(loginRequest.getEmail());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ User not found!");
        }

        // 2) Verify password
        boolean passwordMatch = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        if (!passwordMatch) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid credentials!");
        }

        // 3) Build an Authentication object for Spring Security
        //    You can assign roles/authorities as needed. Here we give a generic ROLE_USER.
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(), // principal (username/email)
                        null,            // credentials (null because we already verified)
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                );

        // 4) Save the authToken in the SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // 5) Create or get the existing HTTP session, and store the SecurityContext there
        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

        // 6) Hide the password before sending user data back
        user.setPassword(null);

        // 7) Return the user data with 200 OK
        return ResponseEntity.ok(user);
    }
}

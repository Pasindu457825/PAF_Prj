package com.paf_grp.backend.controller.pasindu;

import com.paf_grp.backend.model.pasindu.User;
import com.paf_grp.backend.repository.pasindu.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        // Use email instead of username
        User user = userRepository.findByEmailIgnoreCase(loginRequest.getEmail());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ User not found!");
        }

        boolean passwordMatch = passwordEncoder.matches(
                loginRequest.getPassword(), user.getPassword());

        if (!passwordMatch) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid credentials!");
        }

        // Hide password before sending user data back
        user.setPassword(null);

        return ResponseEntity.ok(user);
    }

}

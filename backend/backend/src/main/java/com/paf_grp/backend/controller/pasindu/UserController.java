package com.paf_grp.backend.controller.pasindu;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.paf_grp.backend.model.pasindu.User;
import com.paf_grp.backend.repository.pasindu.UserRepository;
import com.paf_grp.backend.service.OTPService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OTPService otpService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ Forgot Password - Generate OTP
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody String email) {
        if (!userRepository.existsByEmail(email)) {
            return "User with email " + email + " not found.";
        }
        otpService.generateOTP(email); // Generate OTP and send it to the email
        return "OTP sent to " + email;
    }

    // ✅ Send OTP to user's email
    @PostMapping("/send-otp")
    public String sendOtp(@RequestParam String email) {
        if (!userRepository.existsByEmail(email)) {
            return "User with email " + email + " not found.";
        }
        otpService.generateOTP(email); // Generate OTP and send it to the email
        return "OTP sent to " + email;
    }

    // ✅ Verify OTP
    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String email, @RequestParam String otp) {
        if (otpService.validateOTP(email, otp)) {
            otpService.clearOTP(email); // Clear OTP after successful verification
            return "OTP verified successfully.";
        } else {
            return "Invalid or expired OTP.";
        }
    }

    // ✅ Create User (with password hashing)
    @PostMapping
    public User createUser(@RequestBody User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    // ✅ Get All Users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Update User (excluding password by default)
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(updatedUser.getEmail());
            user.setUsername(updatedUser.getUsername());
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    // ✅ Delete User
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return "User with ID " + id + " has been deleted.";
    }
}

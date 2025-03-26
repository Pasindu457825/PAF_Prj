package com.paf_grp.backend.controller.pasindu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;  // This import is necessary
import org.springframework.web.bind.annotation.RestController;

import com.paf_grp.backend.model.pasindu.ForgotPasswordRequest;
import com.paf_grp.backend.service.OTPService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users") // Make sure this annotation is used properly
public class ForgotPasswordController {

    @Autowired
    private OTPService otpService;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            otpService.generateOTP(request.getEmail());
            return ResponseEntity.ok("OTP sent to email!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending OTP. Please try again.");
        }
    }
}

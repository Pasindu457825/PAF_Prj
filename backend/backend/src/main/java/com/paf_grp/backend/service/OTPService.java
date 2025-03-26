package com.paf_grp.backend.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class OTPService {

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, String> otpStorage = new HashMap<>();

    public String generateOTP(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // Generate a random OTP
        otpStorage.put(email, otp);
        sendOtpEmail(email, otp); // Send OTP to email
        return otp;
    }

    public boolean validateOTP(String email, String otp) {
        return otp.equals(otpStorage.get(email)); // Check if OTP is correct
    }

    public void clearOTP(String email) {
        otpStorage.remove(email); // Clear OTP after successful validation
    }

    private void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP is: " + otp + "\nIt is valid for 5 minutes.");
        mailSender.send(message); // Send email to user
    }
}

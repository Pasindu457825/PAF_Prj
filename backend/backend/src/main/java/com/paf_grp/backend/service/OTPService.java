package com.paf_grp.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class OTPService {

    private final JavaMailSender mailSender;

    public OTPService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Method to generate OTP (this can be more complex, like sending an OTP via email)
    public void generateOTP(String email) {
        String otp = generateRandomOTP();
        sendOtpToEmail(email, otp);
    }

    // Generate a random OTP (example logic, this can be more sophisticated)
    private String generateRandomOTP() {
        int otp = (int) (Math.random() * 900000) + 100000; // Generates a 6-digit OTP
        return String.valueOf(otp);
    }

    // Send OTP to the email
    private void sendOtpToEmail(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP for Password Reset");
        message.setText("Your OTP is: " + otp);

        try {
            mailSender.send(message);
            System.out.println("OTP sent to " + email);
        } catch (Exception e) {
            System.out.println("Failed to send OTP: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP");
        }
    }
}

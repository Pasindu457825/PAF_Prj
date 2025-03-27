package com.paf_grp.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf_grp.backend.model.pasindu.User;
import com.paf_grp.backend.repository.pasindu.UserRepository;

import java.util.HashMap;
import java.util.Map;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class OTPService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    // Temporary storage for OTPs (for demonstration purposes)
    private static final Map<String, String> otpStore = new HashMap<>();
    private static final Map<String, Long> otpExpiryStore = new HashMap<>(); // Track OTP expiry time

    @Autowired
    public OTPService(JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    // Generate OTP
    public void generateOTP(String email) {
        String otp = generateRandomOTP();
        sendOtpToEmail(email, otp);
        otpStore.put(email, otp);
        otpExpiryStore.put(email, System.currentTimeMillis() + 5 * 60 * 1000); // OTP expiry time: 5 minutes
    }

    // Generate a random OTP (6-digit OTP)
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

    // Verify OTP
    public boolean verifyOtp(String email, String otp) {
        // Check if OTP exists and is not expired
        if (otpStore.containsKey(email)) {
            if (System.currentTimeMillis() > otpExpiryStore.get(email)) {
                otpStore.remove(email);
                otpExpiryStore.remove(email);
                throw new RuntimeException("OTP expired. Please request a new one.");
            }
            // Check if the provided OTP matches the stored OTP
            if (otp.equals(otpStore.get(email))) {
                otpStore.remove(email);
                otpExpiryStore.remove(email);
                return true;
            }
        }
        return false;
    }

    // Reset Password
    public boolean resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmailIgnoreCase(email);
        if (user != null) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String hashedPassword = encoder.encode(newPassword);  // ✅ Encrypt
            user.setPassword(hashedPassword);
            userRepository.save(user);
            return true;
        }
        return false;
    }



}

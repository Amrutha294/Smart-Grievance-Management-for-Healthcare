package com.example.resolveit_backend.controller;

import com.example.resolveit_backend.dto.ResetPasswordRequest;
import com.example.resolveit_backend.entity.PasswordOtp;
import com.example.resolveit_backend.entity.User;
import com.example.resolveit_backend.repository.PasswordOtpRepository;
import com.example.resolveit_backend.service.EmailService;
import com.example.resolveit_backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordOtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /* ---------- SIGNUP ---------- */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.register(user));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /* ---------- LOGIN ---------- */
    public static class LoginRequest {
        public String email;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userService.authenticate(request.email, request.password)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.status(401).body("Invalid Email or Password"));
    }

    /* ---------- SEND OTP ---------- */
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> req) {

        String email = req.get("email");

        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Email not registered");
        }

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        PasswordOtp po = new PasswordOtp();
        po.setEmail(email);
        po.setOtp(otp);
        po.setExpiry(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(po);

        emailService.sendPasswordResetOtp(email, otp);

        return ResponseEntity.ok("OTP sent successfully");
    }

    /* ---------- RESET PASSWORD ---------- */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        PasswordOtp po =
                otpRepository.findById(request.getEmail()).orElse(null);

        if (po == null) {
            return ResponseEntity.badRequest().body("OTP not found");
        }

        if (!po.getOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        if (po.getExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP expired");
        }

        User user = userService.findByEmail(request.getEmail()).get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userService.save(user);

        otpRepository.delete(po);

        return ResponseEntity.ok("Password updated successfully");
    }
}

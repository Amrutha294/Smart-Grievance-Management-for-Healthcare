package com.example.resolveit_backend.controller;

import com.example.resolveit_backend.entity.Grievance;
import com.example.resolveit_backend.entity.User;
import com.example.resolveit_backend.repository.GrievanceRepository;
import com.example.resolveit_backend.repository.UserRepository;
import com.example.resolveit_backend.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/grievances")
@CrossOrigin(origins = "http://localhost:5173")
public class GrievanceController {

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // ================= SUBMIT GRIEVANCE =================
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createGrievance(
            @RequestParam("title") String title,
            @RequestParam("department") String department,
            @RequestParam("description") String description,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        Grievance g = new Grievance();
        g.setTitle(title);
        g.setDepartment(department);
        g.setDescription(description);
        g.setUser(user);

        if (file != null && !file.isEmpty()) {
            g.setFileName(file.getOriginalFilename());
        }

        // ✅ SAVE GRIEVANCE FIRST (IMPORTANT)
        Grievance saved = grievanceRepository.save(g);

        // ✅ SEND EMAILS (SAFE – WILL NOT BREAK API)
        try {
            // Email to user
            emailService.sendGrievanceSubmittedEmail(
                    user.getEmail(),
                    saved.getTitle(),
                    user.getRole()
            );

            // Email to admin (USE REAL EMAIL HERE)
            emailService.sendAdminGrievanceNotification(
                    "your_real_email@gmail.com",
                    saved.getTitle(),
                    user.getRole()
            );
        } catch (Exception e) {
            System.out.println("Email failed but grievance saved: " + e.getMessage());
        }

        return ResponseEntity.ok(saved);
    }

    // ================= GET USER GRIEVANCES =================
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Grievance>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(grievanceRepository.findByUserId(userId));
    }

    // ================= ADMIN GET ALL =================
    @GetMapping("/all")
    public ResponseEntity<List<Grievance>> getAll() {
        return ResponseEntity.ok(grievanceRepository.findAll());
    }

    // ================= UPDATE STATUS =================
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        Grievance g = grievanceRepository.findById(id).orElse(null);
        if (g == null) {
            return ResponseEntity.badRequest().body("Grievance not found");
        }

        g.setStatus(status);
        g.setUpdatedAt(LocalDateTime.now());

        Grievance saved = grievanceRepository.save(g);

        // ✅ EMAIL WHEN RESOLVED (SAFE)
        if ("RESOLVED".equals(status)) {
            try {
                emailService.sendGrievanceResolvedEmail(
                        g.getUser().getEmail(),
                        g.getTitle(),
                        g.getUser().getRole()
                );
            } catch (Exception e) {
                System.out.println("Resolve email failed: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(saved);
    }

    // ================= COUNTS =================
    @GetMapping("/count/{userId}")
    public Long total(@PathVariable Long userId) {
        return grievanceRepository.countByUserId(userId);
    }

    @GetMapping("/count/pending/{userId}")
    public Long pending(@PathVariable Long userId) {
        return grievanceRepository.countByUserIdAndStatus(userId, "PENDING");
    }

    @GetMapping("/count/progress/{userId}")
    public Long progress(@PathVariable Long userId) {
        return grievanceRepository.countByUserIdAndStatus(userId, "IN_PROGRESS");
    }

    @GetMapping("/count/resolved/{userId}")
    public Long resolved(@PathVariable Long userId) {
        return grievanceRepository.countByUserIdAndStatus(userId, "RESOLVED");
    }
}

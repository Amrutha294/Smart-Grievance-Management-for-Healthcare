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

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

        // ===== FILE UPLOAD =====
        if (file != null && !file.isEmpty()) {
            try {
                String uploadDir = "uploads/";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                g.setFileName(fileName);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("File upload failed");
            }
        }

        Grievance saved = grievanceRepository.save(g);

        // ===== EMAILS (ASYNC) =====
        try {
            emailService.sendGrievanceSubmittedEmail(
                    user.getEmail(),
                    saved.getTitle(),
                    user.getRole()
            );

            List<User> admins = userRepository.findByRole("ADMIN");
            for (User admin : admins) {
                emailService.sendAdminGrievanceNotification(
                        admin.getEmail(),
                        saved.getTitle(),
                        admin.getRole()
                );
            }
        } catch (Exception e) {
            System.out.println("Email error: " + e.getMessage());
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

        if ("RESOLVED".equals(status)) {
            try {
                emailService.sendGrievanceResolvedEmail(
                        g.getUser().getEmail(),
                        g.getTitle(),
                        g.getUser().getRole()
                );
            } catch (Exception e) {
                System.out.println("Resolve email failed");
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

    // ================= DELETE GRIEVANCE (PATIENT) =================
    @DeleteMapping("/{id}/user/{userId}")
    public ResponseEntity<?> deleteGrievance(
            @PathVariable Long id,
            @PathVariable Long userId
    ) {

        Grievance g = grievanceRepository.findById(id).orElse(null);

        if (g == null) {
            return ResponseEntity.badRequest().body("Grievance not found");
        }

        // 🔐 Ensure only owner can delete
        if (!g.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).body("Not authorized");
        }

        // 🚫 Only allow delete when PENDING
        if (!"PENDING".equals(g.getStatus())) {
            return ResponseEntity
                    .badRequest()
                    .body("Cannot delete grievance once it is In Progress or Resolved");
        }

        // 🗑 Delete attached file
        if (g.getFileName() != null) {
            File file = new File("uploads/" + g.getFileName());
            if (file.exists()) {
                file.delete();
            }
        }

        grievanceRepository.deleteById(id);
        return ResponseEntity.ok("Grievance deleted successfully");
    }
}

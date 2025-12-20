package com.example.resolveit_backend.controller;

import com.example.resolveit_backend.entity.Feedback;
import com.example.resolveit_backend.entity.User;
import com.example.resolveit_backend.repository.FeedbackRepository;
import com.example.resolveit_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createFeedback(@RequestBody Feedback feedback) {
        if (feedback.getUser() == null || feedback.getUser().getId() == null) {
            return ResponseEntity.badRequest().body("User ID is required");
        }

        User user = userRepository.findById(feedback.getUser().getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        feedback.setUser(user);
        return ResponseEntity.ok(feedbackRepository.save(feedback));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(feedbackRepository.findByUserId(userId));
    }
}

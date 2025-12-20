package com.example.resolveit_backend.repository;

import com.example.resolveit_backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByUserId(Long userId);
}

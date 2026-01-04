package com.example.resolveit_backend.repository;

import com.example.resolveit_backend.entity.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrievanceRepository extends JpaRepository<Grievance, Long> {

    List<Grievance> findByUserId(Long userId);

    // ✅ For Patient Dashboard (latest first)
    List<Grievance> findByUserIdOrderByCreatedAtDesc(Long userId);

    // ✅ For Admin Dashboard (latest first)
    List<Grievance> findAllByOrderByCreatedAtDesc();

    Long countByUserId(Long userId);

    Long countByUserIdAndStatus(Long userId, String status);
}

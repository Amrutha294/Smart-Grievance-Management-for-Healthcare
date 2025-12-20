package com.example.resolveit_backend.repository;

import com.example.resolveit_backend.entity.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrievanceRepository extends JpaRepository<Grievance, Long> {

    List<Grievance> findByUserId(Long userId);

    Long countByUserId(Long userId);

    Long countByUserIdAndStatus(Long userId, String status);
}

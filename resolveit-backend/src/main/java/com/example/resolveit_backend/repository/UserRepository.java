package com.example.resolveit_backend.repository;

import com.example.resolveit_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);   // ✅ REQUIRED for login

    List<User> findByRole(String role);         // ADMIN / STAFF / PATIENT
}

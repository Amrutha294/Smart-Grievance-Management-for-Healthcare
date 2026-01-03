package com.example.resolveit_backend.repository;

import com.example.resolveit_backend.entity.PasswordOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordOtpRepository extends JpaRepository<PasswordOtp, String> {
}

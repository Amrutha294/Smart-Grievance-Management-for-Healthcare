package com.example.resolveit_backend.service;

import com.example.resolveit_backend.entity.User;
import com.example.resolveit_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ---------- SIGNUP ----------
    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setRole(user.getRole().toUpperCase());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user); // ✅ saves to DB
    }

    // ---------- LOGIN ----------
    public Optional<User> authenticate(String email, String rawPassword) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return Optional.empty();
        }

        User user = optionalUser.get();

        // ✅ Correct password check
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            return Optional.empty();
        }

        // 🔒 Never expose password
        user.setPassword(null);

        // ✅ MUST return user
        return Optional.of(user);
    }
}

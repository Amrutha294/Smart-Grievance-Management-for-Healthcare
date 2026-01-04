package com.example.resolveit_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync   // 👈 ADD THIS
public class ResolveitBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResolveitBackendApplication.class, args);
    }
}


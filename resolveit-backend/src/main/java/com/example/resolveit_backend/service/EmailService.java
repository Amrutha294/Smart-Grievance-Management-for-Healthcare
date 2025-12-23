package com.example.resolveit_backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    
    public void sendSignupEmail(String toEmail, String name, String role) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to ResolveIT");

        message.setText(
                "Hello " + name + ",\n\n" +
                "Your account has been successfully created.\n\n" +
                "Role: " + role + "\n\n" +
                "You can now login and use ResolveIT.\n\n" +
                "Regards,\nResolveIT Team"
        );

        mailSender.send(message);
    }

     // ✅ USER: Grievance submitted
    public void sendGrievanceSubmittedEmail(String toEmail, String title,String role) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Grievance Submitted Successfully");

        message.setText(
            "Hello,\n\n" +
            "Your grievance titled \"" + title + "\" has been submitted successfully.\n\n" +
            "Our team will review it shortly.\n\n" +
            "Regards,\nResolveIT Team"
        );

        mailSender.send(message);
    }

    // ✅ ADMIN: New grievance received
    public void sendAdminGrievanceNotification(String adminEmail, String title, String role) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(adminEmail);
        message.setSubject("New Grievance Received");

        message.setText(
            "Hello Admin,\n\n" +
            "A new grievance has been Received.\n\n" +
            "Title: " + title + "\n\n" +
            "Please login to ResolveIT to review it.\n\n" +
            "Regards,\nResolveIT System"
        );

        mailSender.send(message);
    }
    // ✅ USER: Grievance resolved
    public void sendGrievanceResolvedEmail(String toEmail, String title,String role) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Grievance Resolved");

        message.setText(
            "Hello,\n\n" +
            "Your grievance titled \"" + title + "\" has been resolved.\n\n" +
            "Thank you for using ResolveIT.\n\n" +
            "Regards,\nResolveIT Team"
        );

        mailSender.send(message);
    
        System.out.println("email sent Sucessfully....");
    }
    // ✅ USER: Feedback submitted successfully
    public void sendFeedbackSubmittedEmail(String toEmail, String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Thank You for Your Feedback");

        message.setText(
            "Hello " + fullName + ",\n\n" +
            "Thank you for sharing your feedback.\n\n" +
            "Regards,\nResolveIT Team"
        );

        try {
            mailSender.send(message);
            System.out.println("✅ Feedback email sent to " + toEmail);
        } catch (Exception e) {
            e.printStackTrace(); // 🔥 THIS IS IMPORTANT
        }

    }

}

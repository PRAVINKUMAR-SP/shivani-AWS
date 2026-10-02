package com.shivanitech.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Sender email (this must be verified in AWS SES)
    private final String fromEmail = "noreply@shivanitech.in";

    public void sendRegistrationSuccessEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to Shivani Technologies!");
        message.setText("Hello " + name + ",\n\nYour account has been successfully created. Welcome to Shivani Technologies!\n\nBest regards,\nShivani Tech Team");
        mailSender.send(message);
    }

    public void sendForgotPasswordEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset Request");
        message.setText("You requested a password reset. Please click the link below to reset your password:\n" + resetLink + "\n\nIf you did not request this, please ignore this email.");
        mailSender.send(message);
    }

    public void sendJobAppliedEmail(String toEmail, String jobTitle) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Application Submitted - " + jobTitle);
        message.setText("Your application for the position of '" + jobTitle + "' has been successfully submitted. We will notify you of any updates.\n\nGood luck!");
        mailSender.send(message);
    }

    public void sendEmployerNewApplicationEmail(String employerEmail, String applicantName, String jobTitle) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(employerEmail);
        message.setSubject("New Applicant for " + jobTitle);
        message.setText("Hello,\n\nYou have received a new application for '" + jobTitle + "' from " + applicantName + ".\nLog in to your dashboard to view their profile.");
        mailSender.send(message);
    }

    public void sendApplicationStatusUpdateEmail(String toEmail, String jobTitle, String newStatus) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Application Update - " + jobTitle);
        message.setText("Your application for '" + jobTitle + "' has been updated to: " + newStatus + ".\nCheck your dashboard for details.");
        mailSender.send(message);
    }

    public void sendTestCompletedEmail(String toEmail, String testName, String score) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Skill Test Completed");
        message.setText("You have completed the '" + testName + "' test. Your score is: " + score + ".\nGreat job!");
        mailSender.send(message);
    }
    public void sendJobPostedEmail(String toEmail, String jobTitle) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Job Posted Successfully - " + jobTitle);
        message.setText("Your job listing for '" + jobTitle + "' has been successfully published.\nCandidates can now view and apply to this job.");
        mailSender.send(message);
    }

    public void sendEmployerApprovalEmail(String toEmail, boolean isApproved) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        if (isApproved) {
            message.setSubject("Employer Account Approved");
            message.setText("Congratulations!\n\nYour employer account has been approved by the admin. You can now log in and start posting jobs.");
        } else {
            message.setSubject("Employer Account Status Update");
            message.setText("Your employer account has been reviewed. Unfortunately, it has not been approved at this time. Please contact support for more details.");
        }
        mailSender.send(message);
    }
}

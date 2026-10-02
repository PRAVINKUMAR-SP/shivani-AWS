package com.shivanitech.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Sender email address
    private final String fromEmail = "noreply@shivanitech.in";
    // The display name that appears in the inbox (e.g., "Shivani Technologies")
    private final String fromName = "Shivani Technologies";

    /**
     * Reusable helper method to send beautifully formatted HTML emails.
     */
    private void sendHtmlEmail(String toEmail, String subject, String bodyContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            
            // Build the HTML template
            String htmlContent = "<div style='font-family: \"Segoe UI\", Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;'>"
                + "  <div style='text-align: center; margin-bottom: 30px;'>"
                + "    <h1 style='color: #0056b3; margin: 0; font-size: 28px; letter-spacing: 1px;'>SHIVANI TECHNOLOGIES</h1>" // Can replace this with an <img> tag if you host a logo!
                + "  </div>"
                + "  <div style='color: #444444; font-size: 16px; line-height: 1.6; padding: 0 10px;'>"
                + bodyContent
                + "  </div>"
                + "  <hr style='border: none; border-top: 1px solid #eeeeee; margin: 30px 0;' />"
                + "  <div style='text-align: center; color: #888888; font-size: 12px;'>"
                + "    <p style='margin: 5px 0;'>&copy; " + java.time.Year.now().getValue() + " Shivani Technologies. All rights reserved.</p>"
                + "    <p style='margin: 5px 0;'><a href='https://shivanitech.in' style='color: #0056b3; text-decoration: none;'>www.shivanitech.in</a></p>"
                + "  </div>"
                + "</div>";
                
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send HTML email to " + toEmail + ": " + e.getMessage());
        }
    }

    public void sendRegistrationSuccessEmail(String toEmail, String name) {
        String body = "<h3>Hello " + name + ",</h3>"
                + "<p>Your account has been successfully created.</p>"
                + "<p>We are thrilled to welcome you to the <strong>Shivani Technologies</strong> platform! You can now explore jobs, update your profile, and much more.</p>"
                + "<br/><p>Best regards,<br/><strong>The Shivani Tech Team</strong></p>";
        sendHtmlEmail(toEmail, "Welcome to Shivani Technologies!", body);
    }

    public void sendForgotPasswordEmail(String toEmail, String resetLink) {
        String body = "<h3>Password Reset Request</h3>"
                + "<p>You requested a password reset. Please click the secure link below to choose a new password:</p>"
                + "<p style='text-align: center; margin: 30px 0;'><a href='" + resetLink + "' style='background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;'>Reset Password</a></p>"
                + "<p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>";
        sendHtmlEmail(toEmail, "Password Reset Request", body);
    }

    public void sendJobAppliedEmail(String toEmail, String jobTitle) {
        String body = "<h3>Application Submitted Successfully</h3>"
                + "<p>Your application for the position of <strong style='color: #0056b3;'>" + jobTitle + "</strong> has been successfully received.</p>"
                + "<p>Our recruitment team will review your profile. We will notify you of any updates regarding your application status.</p>"
                + "<br/><p>Good luck!</p>";
        sendHtmlEmail(toEmail, "Application Submitted - " + jobTitle, body);
    }

    public void sendEmployerNewApplicationEmail(String employerEmail, String applicantName, String jobTitle) {
        String body = "<h3>New Job Application Received</h3>"
                + "<p>You have received a new application for the <strong style='color: #0056b3;'>" + jobTitle + "</strong> position from <strong>" + applicantName + "</strong>.</p>"
                + "<p>Log in to your employer dashboard to view their profile, resume, and manage their application status.</p>";
        sendHtmlEmail(employerEmail, "New Applicant for " + jobTitle, body);
    }

    public void sendApplicationStatusUpdateEmail(String toEmail, String jobTitle, String newStatus) {
        String color = newStatus.equalsIgnoreCase("Accepted") || newStatus.equalsIgnoreCase("Approved") ? "green" : (newStatus.equalsIgnoreCase("Rejected") ? "red" : "#0056b3");
        String body = "<h3>Application Status Update</h3>"
                + "<p>There has been an update regarding your application for the <strong style='color: #0056b3;'>" + jobTitle + "</strong> position.</p>"
                + "<p>Your new status is: <strong style='color: " + color + "; font-size: 18px;'>" + newStatus + "</strong></p>"
                + "<p>Please log in to your candidate dashboard for more details.</p>";
        sendHtmlEmail(toEmail, "Application Update - " + jobTitle, body);
    }

    public void sendTestCompletedEmail(String toEmail, String testName, String score) {
        String body = "<h3>Skill Test Completed</h3>"
                + "<p>You have successfully completed the <strong style='color: #0056b3;'>" + testName + "</strong> test.</p>"
                + "<p>Your final score is: <strong style='font-size: 20px; color: green;'>" + score + "</strong></p>"
                + "<p>Great job! This score will be visible on your profile and to employers you apply to.</p>";
        sendHtmlEmail(toEmail, "Skill Test Results: " + testName, body);
    }

    public void sendJobPostedEmail(String toEmail, String jobTitle) {
        String body = "<h3>Job Posted Successfully</h3>"
                + "<p>Your job listing for <strong style='color: #0056b3;'>" + jobTitle + "</strong> has been successfully published on the Shivani Tech portal.</p>"
                + "<p>Candidates can now view your listing and submit applications. You will be notified when new candidates apply.</p>";
        sendHtmlEmail(toEmail, "Job Posted Successfully - " + jobTitle, body);
    }

    public void sendEmployerApprovalEmail(String toEmail, boolean isApproved) {
        String body;
        if (isApproved) {
            body = "<h3>Employer Account Approved!</h3>"
                 + "<p>Congratulations!</p>"
                 + "<p>Your employer account has been officially approved by the admin team. You now have full access to log in, post jobs, and review candidates on the Shivani Tech platform.</p>";
            sendHtmlEmail(toEmail, "Employer Account Approved", body);
        } else {
            body = "<h3>Employer Account Status Update</h3>"
                 + "<p>Your employer account has been reviewed by our administrative team.</p>"
                 + "<p>Unfortunately, it has <strong>not been approved</strong> at this time.</p>"
                 + "<p>Please contact our support team for more details regarding this decision.</p>";
            sendHtmlEmail(toEmail, "Employer Account Status Update", body);
        }
    }
}

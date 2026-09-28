package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.service.SnsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private SnsService snsService;

    @PostMapping
    public ResponseEntity<?> submitContactForm(@RequestBody Map<String, String> contactData) {
        String name = contactData.get("name");
        String email = contactData.get("email");
        String phone = contactData.get("phone");
        String subject = contactData.get("subject");
        String message = contactData.get("message");

        // Format message for SMS to send to admins
        String adminMessage = String.format("New Contact Inquiry!\nName: %s\nEmail: %s\nPhone: %s\nSubject: %s\nMsg: %s", 
                                            name, email, phone, subject, message);

        String[] adminNumbers = {"+918072628827", "+918870242873", "+919790704999"};
        boolean allSent = true;

        for (String adminNumber : adminNumbers) {
            boolean sent = snsService.sendSms(adminNumber, adminMessage);
            if (!sent) {
                allSent = false;
            }
        }

        if (allSent) {
            return ResponseEntity.ok("Message sent successfully");
        } else {
            return ResponseEntity.status(500).body("Failed to send SMS to one or more admin numbers.");
        }
    }
}

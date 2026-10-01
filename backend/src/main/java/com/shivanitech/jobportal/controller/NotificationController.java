package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.service.FirebaseMessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationController {

    @Autowired
    private FirebaseMessagingService firebaseMessagingService;

    public static class NotificationRequest {
        private String targetToken;
        private String title;
        private String body;
        private Map<String, String> data;

        // Getters and Setters
        public String getTargetToken() { return targetToken; }
        public void setTargetToken(String targetToken) { this.targetToken = targetToken; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getBody() { return body; }
        public void setBody(String body) { this.body = body; }
        public Map<String, String> getData() { return data; }
        public void setData(Map<String, String> data) { this.data = data; }
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendNotification(@RequestBody NotificationRequest request) {
        if (request.getTargetToken() == null || request.getTargetToken().isEmpty()) {
            return ResponseEntity.badRequest().body("targetToken is required");
        }
        
        String responseId = firebaseMessagingService.sendPushNotification(
                request.getTargetToken(),
                request.getTitle(),
                request.getBody(),
                request.getData()
        );

        if (responseId != null) {
            return ResponseEntity.ok(Map.of("success", true, "messageId", responseId));
        } else {
            return ResponseEntity.internalServerError().body("Failed to send notification.");
        }
    }
}

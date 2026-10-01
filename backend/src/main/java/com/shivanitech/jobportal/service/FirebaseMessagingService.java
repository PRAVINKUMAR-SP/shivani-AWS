package com.shivanitech.jobportal.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FirebaseMessagingService {

    /**
     * Send a push notification to a specific device token.
     * @param targetToken The FCM token of the device.
     * @param title The title of the notification.
     * @param body The body text of the notification.
     * @param data Optional extra data (key-value pairs) for deep linking, etc.
     * @return The message ID if successful.
     */
    public String sendPushNotification(String targetToken, String title, String body, Map<String, String> data) {
        // Create the notification block (REQUIRED for background system tray popups)
        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        // Build the message
        Message.Builder messageBuilder = Message.builder()
                .setToken(targetToken)
                .setNotification(notification);

        // Add any extra data payloads if provided
        if (data != null && !data.isEmpty()) {
            messageBuilder.putAllData(data);
        }

        Message message = messageBuilder.build();

        try {
            // Send the message using FirebaseMessaging
            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Successfully sent message: " + response);
            return response;
        } catch (FirebaseMessagingException e) {
            System.err.println("Error sending Firebase message: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}

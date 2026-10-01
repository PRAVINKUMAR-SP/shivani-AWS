package com.shivanitech.jobportal.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            // Checks if Firebase is already initialized
            if (FirebaseApp.getApps().isEmpty()) {
                // Ensure you have this file in src/main/resources/
                ClassPathResource serviceAccount = new ClassPathResource("firebase-service-account.json");
                
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount.getInputStream()))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("Firebase Admin SDK initialized.");
            }
        } catch (IOException e) {
            System.err.println("Failed to initialize Firebase Admin SDK. Please ensure firebase-service-account.json exists in src/main/resources/");
        }
    }
}

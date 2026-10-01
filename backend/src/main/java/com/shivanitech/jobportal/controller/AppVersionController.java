package com.shivanitech.jobportal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/app-version")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AppVersionController {

    @GetMapping
    public ResponseEntity<?> getAppVersion() {
        // You can later move these values to a database or application.yml
        // so you don't have to recompile the backend to change the latest version.
        return ResponseEntity.ok(Map.of(
                "latestVersion", "1.0.1",
                "forceUpdate", true, // If true, the user CANNOT close the update popup
                "updateUrl", "https://your-website.com/downloads/shivani-app-v1.0.1.apk", // Change to PlayStore URL if using PlayStore
                "releaseNotes", "We have added real-time push notifications and performance improvements. Please update to continue!"
        ));
    }
}

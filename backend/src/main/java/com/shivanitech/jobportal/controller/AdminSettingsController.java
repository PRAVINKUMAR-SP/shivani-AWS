package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.service.SystemStateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.management.ManagementFactory;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/settings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminSettingsController {

    @Autowired
    private SystemStateService systemStateService;

    @GetMapping("/health")
    public ResponseEntity<?> getHealth() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("database", "CONNECTED");
        healthInfo.put("uptimeMillis", ManagementFactory.getRuntimeMXBean().getUptime());
        healthInfo.put("maintenanceMode", systemStateService.isMaintenanceMode());
        return ResponseEntity.ok(healthInfo);
    }

    @PostMapping("/maintenance")
    public ResponseEntity<?> toggleMaintenance(@RequestBody Map<String, Boolean> request) {
        Boolean enabled = request.get("enabled");
        if (enabled != null) {
            systemStateService.setMaintenanceMode(enabled);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Maintenance mode updated");
        response.put("maintenanceMode", systemStateService.isMaintenanceMode());
        return ResponseEntity.ok(response);
    }
}

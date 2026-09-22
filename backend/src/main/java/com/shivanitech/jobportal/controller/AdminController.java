package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.model.Role;
import com.shivanitech.jobportal.repository.ApplicationRepository;
import com.shivanitech.jobportal.repository.JobRepository;
import com.shivanitech.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Principal principal) {
        // In a real app, verify ADMIN role here
        // But for demo purposes, if employer is taking the place of admin, we just allow it

        long totalUsers = userRepository.count();
        long totalSeekers = userRepository.findAll().stream().filter(u -> u.getRole() == Role.SEEKER).count();
        long totalEmployers = userRepository.findAll().stream().filter(u -> u.getRole() == Role.EMPLOYER).count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalSeekers", totalSeekers);
        stats.put("totalEmployers", totalEmployers);
        stats.put("totalJobs", totalJobs);
        stats.put("totalApplications", totalApplications);

        return ResponseEntity.ok(stats);
    }
}

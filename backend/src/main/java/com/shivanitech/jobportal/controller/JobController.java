package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.model.Job;
import com.shivanitech.jobportal.model.User;
import com.shivanitech.jobportal.repository.JobRepository;
import com.shivanitech.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*") // Allows the frontend to connect
public class JobController {

    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody Job job, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        User employer = userRepository.findByEmail(principal.getName()).orElse(null);
        if (employer == null || !employer.getRole().name().equals("EMPLOYER")) {
            return ResponseEntity.status(403).body("Only employers can post jobs.");
        }
        
        job.setEmployer(employer);
        Job savedJob = jobRepository.save(job);
        return ResponseEntity.ok(savedJob);
    }
}

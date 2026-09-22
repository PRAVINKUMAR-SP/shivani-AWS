package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.model.Application;
import com.shivanitech.jobportal.model.Job;
import com.shivanitech.jobportal.model.User;
import com.shivanitech.jobportal.repository.ApplicationRepository;
import com.shivanitech.jobportal.repository.JobRepository;
import com.shivanitech.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{jobId}")
    public ResponseEntity<?> applyForJob(@PathVariable Long jobId, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        
        User seeker = userRepository.findByEmail(principal.getName()).orElse(null);
        if (seeker == null || !seeker.getRole().name().equals("SEEKER")) {
            return ResponseEntity.status(403).body("Only job seekers can apply for jobs.");
        }

        if (applicationRepository.existsBySeekerIdAndJobId(seeker.getId(), jobId)) {
            return ResponseEntity.badRequest().body("You have already applied for this job.");
        }

        Job job = jobRepository.findById(jobId).orElse(null);
        if (job == null) return ResponseEntity.notFound().build();

        Application application = new Application();
        application.setJob(job);
        application.setSeeker(seeker);
        
        applicationRepository.save(application);
        return ResponseEntity.ok("Successfully applied!");
    }

    @GetMapping("/seeker")
    public ResponseEntity<?> getSeekerApplications(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        User seeker = userRepository.findByEmail(principal.getName()).orElse(null);
        if (seeker == null) return ResponseEntity.status(401).build();

        List<Application> apps = applicationRepository.findBySeekerId(seeker.getId());
        return ResponseEntity.ok(apps);
    }
}

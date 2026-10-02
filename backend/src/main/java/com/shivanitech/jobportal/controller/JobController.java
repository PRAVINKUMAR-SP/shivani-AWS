package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.model.Job;
import com.shivanitech.jobportal.model.User;
import com.shivanitech.jobportal.repository.JobRepository;
import com.shivanitech.jobportal.repository.UserRepository;
import com.shivanitech.jobportal.repository.ApplicationRepository;
import com.shivanitech.jobportal.repository.SavedJobRepository;
import com.shivanitech.jobportal.repository.InviteRepository;
import com.shivanitech.jobportal.model.SavedJob;
import com.shivanitech.jobportal.model.Invite;
import com.shivanitech.jobportal.service.EmailService;
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

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private InviteRepository inviteRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/employer")
    public ResponseEntity<?> getEmployerJobs(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        User employer = userRepository.findByEmail(principal.getName()).orElse(null);
        if (employer == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(jobRepository.findByEmployerId(employer.getId()));
    }

    @GetMapping("/employer/stats")
    public ResponseEntity<?> getEmployerStats(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        User employer = userRepository.findByEmail(principal.getName()).orElse(null);
        if (employer == null) return ResponseEntity.status(401).build();
        
        long activeListings = jobRepository.countByEmployerId(employer.getId());
        long totalApplications = applicationRepository.countByJobEmployerId(employer.getId());
        long shortlistedCount = applicationRepository.countByJobEmployerIdAndStatus(employer.getId(), "SHORTLISTED");

        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("activeListings", activeListings);
        stats.put("totalApplications", totalApplications);
        stats.put("shortlistedCount", shortlistedCount);
        
        return ResponseEntity.ok(stats);
    }
    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody Job job, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        User employer = userRepository.findByEmail(principal.getName()).orElse(null);
        if (employer == null || (!employer.getRole().name().equals("EMPLOYER") && !employer.getRole().name().equals("ADMIN"))) {
            return ResponseEntity.status(403).body("Only employers or admins can post jobs.");
        }
        
        job.setEmployer(employer);
        Job savedJob = jobRepository.save(job);
        
        try {
            emailService.sendJobPostedEmail(employer.getEmail(), savedJob.getTitle());
        } catch (Exception e) {
            System.err.println("Failed to send job posted email: " + e.getMessage());
        }

        return ResponseEntity.ok(savedJob);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody Job updatedJob, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        User employer = userRepository.findByEmail(principal.getName()).orElse(null);
        if (employer == null) return ResponseEntity.status(401).build();

        Job existingJob = jobRepository.findById(id).orElse(null);
        if (existingJob == null) return ResponseEntity.notFound().build();

        if (!existingJob.getEmployer().getId().equals(employer.getId()) && !employer.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).body("You can only edit your own jobs.");
        }

        existingJob.setTitle(updatedJob.getTitle());
        existingJob.setCompany(updatedJob.getCompany());
        existingJob.setLocation(updatedJob.getLocation());
        existingJob.setSalary(updatedJob.getSalary());
        existingJob.setType(updatedJob.getType());
        existingJob.setTags(updatedJob.getTags());

        return ResponseEntity.ok(jobRepository.save(existingJob));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        User employer = userRepository.findByEmail(principal.getName()).orElse(null);
        if (employer == null) return ResponseEntity.status(401).build();

        Job existingJob = jobRepository.findById(id).orElse(null);
        if (existingJob == null) return ResponseEntity.notFound().build();

        if (!existingJob.getEmployer().getId().equals(employer.getId()) && !employer.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).body("You can only delete your own jobs.");
        }

        // Need to delete related applications first to avoid foreign key constraint violations
        List<SavedJob> savedJobs = savedJobRepository.findByJobId(id);
        savedJobRepository.deleteAll(savedJobs);
        
        List<Invite> invites = inviteRepository.findByJobId(id);
        inviteRepository.deleteAll(invites);
        
        List<com.shivanitech.jobportal.model.Application> apps = applicationRepository.findByJobId(id);
        applicationRepository.deleteAll(apps);
        
        jobRepository.delete(existingJob);
        return ResponseEntity.ok("Job deleted successfully");
    }
}

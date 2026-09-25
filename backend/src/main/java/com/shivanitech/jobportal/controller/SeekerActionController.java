package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.model.*;
import com.shivanitech.jobportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seeker")
@CrossOrigin(origins = "*")
public class SeekerActionController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private InviteRepository inviteRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private User getSeeker(Principal principal) {
        if (principal == null) return null;
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user != null && (user.getRole().name().equals("SEEKER") || user.getRole().name().equals("ADMIN"))) {
            return user;
        }
        return null;
    }

    // --- Saved Jobs ---

    @GetMapping("/saved-jobs")
    public ResponseEntity<?> getSavedJobs(Principal principal) {
        User seeker = getSeeker(principal);
        if (seeker == null) return ResponseEntity.status(401).body("Unauthorized or not a seeker");

        List<SavedJob> savedJobs = savedJobRepository.findBySeeker(seeker);
        return ResponseEntity.ok(savedJobs);
    }

    @PostMapping("/save-job/{jobId}")
    public ResponseEntity<?> toggleSaveJob(@PathVariable Long jobId, Principal principal) {
        User seeker = getSeeker(principal);
        if (seeker == null) return ResponseEntity.status(401).body("Unauthorized");

        Job job = jobRepository.findById(jobId).orElse(null);
        if (job == null) return ResponseEntity.notFound().build();

        Optional<SavedJob> existing = savedJobRepository.findBySeekerAndJob(seeker, job);
        if (existing.isPresent()) {
            // Unsave
            savedJobRepository.delete(existing.get());
            return ResponseEntity.ok("Job removed from saved list");
        } else {
            // Save
            SavedJob savedJob = new SavedJob();
            savedJob.setSeeker(seeker);
            savedJob.setJob(job);
            savedJobRepository.save(savedJob);
            return ResponseEntity.ok("Job saved successfully");
        }
    }

    // --- Invites ---

    @GetMapping("/invites")
    public ResponseEntity<?> getInvites(Principal principal) {
        User seeker = getSeeker(principal);
        if (seeker == null) return ResponseEntity.status(401).build();

        List<Invite> invites = inviteRepository.findBySeeker(seeker);
        return ResponseEntity.ok(invites);
    }

    @PostMapping("/invites/{inviteId}/status")
    public ResponseEntity<?> updateInviteStatus(@PathVariable Long inviteId, @RequestParam String status, Principal principal) {
        User seeker = getSeeker(principal);
        if (seeker == null) return ResponseEntity.status(401).build();

        Invite invite = inviteRepository.findById(inviteId).orElse(null);
        if (invite == null || !invite.getSeeker().getId().equals(seeker.getId())) {
            return ResponseEntity.notFound().build();
        }

        if (!status.equals("ACCEPTED") && !status.equals("DECLINED")) {
            return ResponseEntity.badRequest().body("Invalid status");
        }

        invite.setStatus(status);
        inviteRepository.save(invite);
        return ResponseEntity.ok("Invite " + status.toLowerCase());
    }

    // --- Notifications ---

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(Principal principal) {
        User seeker = getSeeker(principal);
        if (seeker == null) return ResponseEntity.status(401).build();

        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(seeker);
        return ResponseEntity.ok(notifications);
    }
}

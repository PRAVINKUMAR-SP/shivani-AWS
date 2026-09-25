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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seeker")
@CrossOrigin(origins = "*")
public class JobSeekerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getSeekerStats(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        User seeker = userRepository.findByEmail(principal.getName()).orElse(null);
        if (seeker == null) return ResponseEntity.notFound().build();

        List<Application> apps = applicationRepository.findBySeekerId(seeker.getId());
        long appliedCount = apps.size();
        long shortlistedCount = apps.stream().filter(a -> "ACCEPTED".equalsIgnoreCase(a.getStatus())).count();

        List<Job> allJobs = jobRepository.findAll();
        long matchingCount = 0;

        if (seeker.getJobRole() != null || seeker.getLocation() != null || seeker.getSkills() != null) {
            matchingCount = allJobs.stream().filter(job -> {
                boolean matchRole = seeker.getJobRole() != null && job.getTitle() != null && job.getTitle().toLowerCase().contains(seeker.getJobRole().toLowerCase());
                boolean matchLoc = seeker.getLocation() != null && job.getLocation() != null && job.getLocation().equalsIgnoreCase(seeker.getLocation());
                boolean matchSkill = false;
                
                if (seeker.getSkills() != null && !seeker.getSkills().trim().isEmpty() && job.getTags() != null) {
                    String[] userSkills = seeker.getSkills().toLowerCase().split(",");
                    for (String tag : job.getTags()) {
                        for (String us : userSkills) {
                            if (tag.toLowerCase().contains(us.trim())) {
                                matchSkill = true;
                                break;
                            }
                        }
                        if (matchSkill) break;
                    }
                }
                return matchRole || matchLoc || matchSkill;
            }).count();
        }

        Map<String, Long> stats = new HashMap<>();
        stats.put("appliedCount", appliedCount);
        stats.put("shortlistedCount", shortlistedCount);
        stats.put("matchingCount", matchingCount);

        return ResponseEntity.ok(stats);
    }
}

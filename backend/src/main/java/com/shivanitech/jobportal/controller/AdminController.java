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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import com.shivanitech.jobportal.model.User;
import java.util.Optional;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import com.shivanitech.jobportal.model.Job;
import com.shivanitech.jobportal.model.Application;

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

    @GetMapping("/graph-stats")
    public ResponseEntity<?> getGraphStats(Principal principal) {
        List<String> jobDates = jobRepository.findAll().stream()
            .map(j -> j.getPostedAt() != null ? j.getPostedAt().toString() : LocalDateTime.now().toString())
            .collect(Collectors.toList());
            
        List<String> appDates = applicationRepository.findAll().stream()
            .map(a -> a.getAppliedAt() != null ? a.getAppliedAt().toString() : LocalDateTime.now().toString())
            .collect(Collectors.toList());

        List<String> userDates = userRepository.findAll().stream()
            .map(u -> u.getCreatedAt() != null ? u.getCreatedAt().toString() : LocalDateTime.now().toString())
            .collect(Collectors.toList());

        Map<String, List<String>> graphData = new HashMap<>();
        graphData.put("jobs", jobDates);
        graphData.put("applications", appDates);
        graphData.put("users", userDates);

        return ResponseEntity.ok(graphData);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(Principal principal) {
        // Returns the list of all registered users
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam String newRole) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            try {
                user.setRole(Role.valueOf(newRole.toUpperCase()));
                userRepository.save(user);
                return ResponseEntity.ok(user);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid role");
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> getAllJobs(Principal principal) {
        List<Map<String, Object>> jobsList = new ArrayList<>();
        List<Job> jobs = jobRepository.findAll();
        for (Job job : jobs) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", job.getId());
            map.put("title", job.getTitle());
            map.put("company", job.getCompany());
            map.put("postedAt", job.getPostedAt());
            
            // Get employer name
            String employerName = "Unknown";
            if (job.getEmployer() != null && job.getEmployer().getId() != null) {
                Optional<User> employer = userRepository.findById(job.getEmployer().getId());
                if (employer.isPresent()) {
                    employerName = employer.get().getName();
                }
            }
            map.put("employerName", employerName);
            
            // Get applicants count
            List<Application> apps = applicationRepository.findByJobId(job.getId());
            map.put("applicantsCount", apps.size());
            
            // Get selected count
            long selectedCount = apps.stream()
                .filter(a -> "ACCEPTED".equalsIgnoreCase(a.getStatus()))
                .count();
            map.put("selectedCount", selectedCount);
            
            jobsList.add(map);
        }
        return ResponseEntity.ok(jobsList);
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        if (jobRepository.existsById(id)) {
            List<Application> apps = applicationRepository.findByJobId(id);
            applicationRepository.deleteAll(apps);
            jobRepository.deleteById(id);
            return ResponseEntity.ok("Job deleted");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications(Principal principal) {
        List<Map<String, Object>> appsList = new ArrayList<>();
        List<Application> applications = applicationRepository.findAll();
        for (Application app : applications) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", app.getId());
            map.put("appliedAt", app.getAppliedAt());
            map.put("status", app.getStatus());
            
            if (app.getJob() != null) {
                map.put("jobTitle", app.getJob().getTitle());
                map.put("jobCompany", app.getJob().getCompany());
            } else {
                map.put("jobTitle", "Unknown");
                map.put("jobCompany", "Unknown");
            }
            
            if (app.getSeeker() != null) {
                map.put("seekerName", app.getSeeker().getName());
                map.put("seekerEmail", app.getSeeker().getEmail());
                map.put("seekerPhone", app.getSeeker().getPhoneNo());
                map.put("seekerSkills", app.getSeeker().getSkills());
                map.put("seekerLocation", app.getSeeker().getLocation());
                map.put("resumeUrl", app.getSeeker().getResumeUrl());
            } else {
                map.put("seekerName", "Unknown");
                map.put("seekerEmail", "Unknown");
                map.put("seekerPhone", "Unknown");
                map.put("seekerSkills", "Unknown");
                map.put("seekerLocation", "Unknown");
                map.put("resumeUrl", null);
            }
            
            appsList.add(map);
        }
        return ResponseEntity.ok(appsList);
    }

    @GetMapping("/employers")
    public ResponseEntity<?> getAllEmployers(Principal principal) {
        List<User> employers = userRepository.findAll().stream()
            .filter(u -> u.getRole() == Role.EMPLOYER)
            .collect(Collectors.toList());
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (User emp : employers) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", emp.getId());
            map.put("name", emp.getName());
            map.put("companyName", emp.getCompanyName());
            map.put("phoneNo", emp.getPhoneNo());
            map.put("email", emp.getEmail());
            map.put("isApproved", emp.getIsApproved());
            
            List<Job> employerJobs = jobRepository.findByEmployerId(emp.getId());
            map.put("totalJobs", employerJobs.size());
            
            long shortlistedCount = 0;
            for (Job job : employerJobs) {
                shortlistedCount += applicationRepository.findByJobId(job.getId()).stream()
                    .filter(a -> "SHORTLISTED".equalsIgnoreCase(a.getStatus()) || "ACCEPTED".equalsIgnoreCase(a.getStatus()))
                    .count();
            }
            map.put("shortlistedCount", shortlistedCount);
            
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/employers/{id}/approve")
    public ResponseEntity<?> approveEmployer(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent() && userOpt.get().getRole() == Role.EMPLOYER) {
            User user = userOpt.get();
            user.setIsApproved(true);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
}

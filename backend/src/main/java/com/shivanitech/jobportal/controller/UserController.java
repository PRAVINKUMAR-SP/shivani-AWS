package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.model.User;
import com.shivanitech.jobportal.payload.ProfileUpdateRequest;
import com.shivanitech.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhoneNo() != null) user.setPhoneNo(request.getPhoneNo());
        if (request.getResumeUrl() != null) user.setResumeUrl(request.getResumeUrl());
        if (request.getCompanyName() != null) user.setCompanyName(request.getCompanyName());
        if (request.getCompanyDescription() != null) user.setCompanyDescription(request.getCompanyDescription());
        if (request.getSkills() != null) user.setSkills(request.getSkills());
        if (request.getJobRole() != null) user.setJobRole(request.getJobRole());
        if (request.getLocation() != null) user.setLocation(request.getLocation());

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}

package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.model.Role;
import com.shivanitech.jobportal.model.User;
import com.shivanitech.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/employers")
    public ResponseEntity<?> getAllEmployers() {
        List<User> employers = userRepository.findAll().stream()
            .filter(u -> u.getRole() == Role.EMPLOYER && u.getIsApproved())
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(employers);
    }
}

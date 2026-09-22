package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.model.Role;
import com.shivanitech.jobportal.model.User;
import com.shivanitech.jobportal.payload.JwtResponse;
import com.shivanitech.jobportal.payload.LoginRequest;
import com.shivanitech.jobportal.payload.SignupRequest;
import com.shivanitech.jobportal.repository.UserRepository;
import com.shivanitech.jobportal.security.CustomUserDetails;
import com.shivanitech.jobportal.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getUser().getId(),
                userDetails.getUser().getEmail(),
                userDetails.getUser().getName(),
                userDetails.getUser().getRole().name()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        String strRole = signUpRequest.getRole();
        if (strRole == null) {
            user.setRole(Role.SEEKER);
        } else {
            if (strRole.equalsIgnoreCase("EMPLOYER")) {
                user.setRole(Role.EMPLOYER);
            } else {
                user.setRole(Role.SEEKER);
            }
        }

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}

package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.model.Role;
import com.shivanitech.jobportal.model.User;
import com.shivanitech.jobportal.payload.JwtResponse;
import com.shivanitech.jobportal.payload.LoginRequest;
import com.shivanitech.jobportal.payload.SignupRequest;
import com.shivanitech.jobportal.repository.UserRepository;
import com.shivanitech.jobportal.security.CustomUserDetails;
import com.shivanitech.jobportal.security.JwtUtils;
import com.shivanitech.jobportal.service.SystemStateService;
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

    @Autowired
    SystemStateService systemStateService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        if (systemStateService.isMaintenanceMode()) {
            User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
            if (user == null || user.getRole() != Role.ADMIN) {
                return ResponseEntity.status(503).body("System is currently under maintenance. Only administrators can log in.");
            }
        }

        // Auto-promote pravin007ptk@gmail.com to ADMIN
        if (loginRequest.getEmail().equalsIgnoreCase("pravin007ptk@gmail.com")) {
            User user = userRepository.findByEmail("pravin007ptk@gmail.com").orElse(null);
            if (user != null && user.getRole() != Role.ADMIN) {
                user.setRole(Role.ADMIN);
                userRepository.save(user);
            }
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User loggedInUser = userDetails.getUser();

        if (loggedInUser.getRole() == Role.EMPLOYER && Boolean.FALSE.equals(loggedInUser.getIsApproved())) {
            return ResponseEntity.status(403).body("Error: Employer account pending admin approval.");
        }

        String jwt = jwtUtils.generateJwtToken(authentication);

        // Ensure we fetch the potentially updated role
        String roleStr = userDetails.getUser().getRole().name();
        if (loginRequest.getEmail().equalsIgnoreCase("pravin007ptk@gmail.com")) {
            roleStr = "ADMIN";
        }

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getUser().getId(),
                userDetails.getUser().getEmail(),
                userDetails.getUser().getName(),
                roleStr,
                userDetails.getUser().getCompanyName()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (systemStateService.isMaintenanceMode()) {
            return ResponseEntity.status(503).body("Error: System is currently under maintenance. Registration is temporarily disabled.");
        }

        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setPhoneNo(signUpRequest.getPhoneNo());

        if (signUpRequest.getEmail().equalsIgnoreCase("pravin007ptk@gmail.com")) {
            user.setRole(Role.ADMIN);
        } else {
            String strRole = signUpRequest.getRole();
            if (strRole == null) {
                user.setRole(Role.SEEKER);
            } else {
                if (strRole.equalsIgnoreCase("EMPLOYER")) {
                    user.setRole(Role.EMPLOYER);
                    user.setCompanyName(signUpRequest.getCompanyName());
                    user.setIsApproved(false);
                } else {
                    user.setRole(Role.SEEKER);
                }
            }
        }

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogleUser(@RequestBody com.shivanitech.jobportal.payload.GoogleLoginRequest request) {
        if (systemStateService.isMaintenanceMode()) {
            return ResponseEntity.status(503).body("System is currently under maintenance.");
        }

        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setBearerAuth(request.getToken());
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>("parameters", headers);
            
            ResponseEntity<java.util.Map> response = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo", 
                    org.springframework.http.HttpMethod.GET, 
                    entity, 
                    java.util.Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                java.util.Map<String, Object> userInfo = response.getBody();
                String email = (String) userInfo.get("email");
                String name = (String) userInfo.get("name");

                if (email == null) {
                    return ResponseEntity.badRequest().body("Error: Email not found from Google.");
                }

                User user = userRepository.findByEmail(email).orElse(null);
                boolean isNewUser = false;
                
                if (user == null) {
                    if (request.getPhoneNo() == null || request.getPhoneNo().isEmpty()) {
                        java.util.Map<String, String> responseBody = new java.util.HashMap<>();
                        responseBody.put("requireDetails", "true");
                        responseBody.put("email", email);
                        responseBody.put("name", name != null ? name : email.split("@")[0]);
                        return ResponseEntity.ok(responseBody);
                    }

                    user = new User();
                    user.setEmail(email);
                    user.setName(request.getName() != null && !request.getName().isEmpty() ? request.getName() : (name != null ? name : email.split("@")[0]));
                    user.setPhoneNo(request.getPhoneNo());
                    user.setPassword(encoder.encode(java.util.UUID.randomUUID().toString())); // Random password
                    
                    if (email.equalsIgnoreCase("pravin007ptk@gmail.com")) {
                        user.setRole(Role.ADMIN);
                    } else {
                        String roleStr = request.getRole();
                        if ("EMPLOYER".equalsIgnoreCase(roleStr)) {
                            user.setRole(Role.EMPLOYER);
                            user.setIsApproved(false);
                            user.setCompanyName(request.getCompanyName());
                        } else {
                            user.setRole(Role.SEEKER);
                        }
                    }
                    userRepository.save(user);
                    isNewUser = true;
                }

                if (user.getRole() == Role.EMPLOYER && Boolean.FALSE.equals(user.getIsApproved())) {
                    return ResponseEntity.status(403).body("Error: Employer account pending admin approval.");
                }

                // Since we bypassed normal AuthenticationManager, we create a custom UserDetails manually
                CustomUserDetails userDetails = new CustomUserDetails(user);
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String jwt = jwtUtils.generateJwtToken(authentication);

                return ResponseEntity.ok(new JwtResponse(jwt,
                        user.getId(),
                        user.getEmail(),
                        user.getName(),
                        user.getRole().name(),
                        user.getCompanyName()));

            } else {
                return ResponseEntity.badRequest().body("Error: Invalid Google token.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Authentication with Google failed.");
        }
    }
}

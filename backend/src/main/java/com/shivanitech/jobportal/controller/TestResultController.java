package com.shivanitech.jobportal.controller;

import com.shivanitech.jobportal.model.TestResult;
import com.shivanitech.jobportal.model.User;
import com.shivanitech.jobportal.repository.TestResultRepository;
import com.shivanitech.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestResultController {

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitResult(@RequestBody Map<String, Integer> payload, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Unauthorized");
        
        Optional<User> userOpt = userRepository.findByEmail(principal.getName());
        if (!userOpt.isPresent()) return ResponseEntity.badRequest().body("User not found");
        
        TestResult result = new TestResult();
        result.setUser(userOpt.get());
        result.setScore(payload.get("score"));
        result.setTotalQuestions(payload.get("totalQuestions"));
        testResultRepository.save(result);
        
        return ResponseEntity.ok("Result saved successfully");
    }

    @GetMapping("/results")
    public ResponseEntity<?> getAllResults() {
        List<Map<String, Object>> resultList = new ArrayList<>();
        List<TestResult> results = testResultRepository.findAll();
        
        for (TestResult r : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("score", r.getScore());
            map.put("totalQuestions", r.getTotalQuestions());
            map.put("completedAt", r.getCompletedAt());
            if (r.getUser() != null) {
                map.put("name", r.getUser().getName());
                map.put("email", r.getUser().getEmail());
                map.put("phoneNo", r.getUser().getPhoneNo());
            }
            resultList.add(map);
        }
        
        return ResponseEntity.ok(resultList);
    }
}

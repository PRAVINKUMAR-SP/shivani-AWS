package com.shivanitech.jobportal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs", indexes = {
    @Index(name = "idx_job_employer_id", columnList = "employer_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String company;
    private String location;
    private String salary;
    private String type;
    
    @ElementCollection
    private List<String> tags;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User employer;
    
    private LocalDateTime postedAt;
    
    @PrePersist
    protected void onCreate() {
        postedAt = LocalDateTime.now();
    }
}

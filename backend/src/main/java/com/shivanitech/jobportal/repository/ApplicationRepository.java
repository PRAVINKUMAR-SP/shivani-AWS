package com.shivanitech.jobportal.repository;

import com.shivanitech.jobportal.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findBySeekerId(Long seekerId);
    List<Application> findByJobId(Long jobId);
    boolean existsBySeekerIdAndJobId(Long seekerId, Long jobId);
}

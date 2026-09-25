package com.shivanitech.jobportal.repository;

import com.shivanitech.jobportal.model.SavedJob;
import com.shivanitech.jobportal.model.User;
import com.shivanitech.jobportal.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findBySeeker(User seeker);
    Optional<SavedJob> findBySeekerAndJob(User seeker, Job job);
}

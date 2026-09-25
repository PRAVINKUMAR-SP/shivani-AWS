package com.shivanitech.jobportal.repository;

import com.shivanitech.jobportal.model.Invite;
import com.shivanitech.jobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InviteRepository extends JpaRepository<Invite, Long> {
    List<Invite> findBySeeker(User seeker);
    List<Invite> findByEmployer(User employer);
}

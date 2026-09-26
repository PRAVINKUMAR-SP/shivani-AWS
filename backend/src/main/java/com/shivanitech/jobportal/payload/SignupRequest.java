package com.shivanitech.jobportal.payload;

import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String role; // "SEEKER" or "EMPLOYER"
    private String phoneNo;
    private String companyName;
}

package com.shivanitech.jobportal.payload;

import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String token; // The access token from Google
    private String role; // The role chosen by the user (SEEKER, EMPLOYER)
    private String phoneNo;
    private String name;
    private String companyName;
}

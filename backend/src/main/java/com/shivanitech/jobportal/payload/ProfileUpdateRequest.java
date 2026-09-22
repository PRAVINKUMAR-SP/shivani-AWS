package com.shivanitech.jobportal.payload;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String phoneNo;
    private String resumeUrl;
    private String companyName;
    private String companyDescription;
}

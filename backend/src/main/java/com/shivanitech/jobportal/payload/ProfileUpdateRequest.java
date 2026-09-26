package com.shivanitech.jobportal.payload;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String phoneNo;
    private String resumeUrl;
    private String companyName;
    private String companyDescription;
    private String skills;
    private String jobRole;
    private String location;
    private String collegeName;
    private String course;
    private String department;
    private String cgpa;
    private String aboutMe;
}

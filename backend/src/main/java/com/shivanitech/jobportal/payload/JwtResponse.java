package com.shivanitech.jobportal.payload;

import lombok.Data;
import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String name;
    private String role;
    private String companyName;

    public JwtResponse(String accessToken, Long id, String email, String name, String role, String companyName) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.companyName = companyName;
    }
}

package com.shelton.expense_tracker_backend.dto.auth;

import lombok.Data;

// LoginRequest.java
@Data
public class LoginRequest {
    private String email;
    private String password;
}
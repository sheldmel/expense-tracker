package com.shelton.expense_tracker_backend.controller;

import com.shelton.expense_tracker_backend.dto.auth.AuthResponse;
import com.shelton.expense_tracker_backend.dto.auth.LoginRequest;
import com.shelton.expense_tracker_backend.dto.auth.RegisterRequest;
import com.shelton.expense_tracker_backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthService authService;

    public AuthenticationController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.signin(request));
    }
}

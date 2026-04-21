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
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(201).body(response);

        } catch (RuntimeException e) {
            if (e.getMessage().contains("Email")) {
                return ResponseEntity.status(409).body(e.getMessage());
            }
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.signin(request);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(400)
                    .body(e.getMessage());
        }
    }
}

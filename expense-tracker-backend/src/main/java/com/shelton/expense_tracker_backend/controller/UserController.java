package com.shelton.expense_tracker_backend.controller;

import com.shelton.expense_tracker_backend.dto.auth.AuthResponse;
import com.shelton.expense_tracker_backend.dto.user.ChangePasswordRequest;
import com.shelton.expense_tracker_backend.dto.user.UpdateProfileRequest;
import com.shelton.expense_tracker_backend.dto.user.UserResponse;
import com.shelton.expense_tracker_backend.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<AuthResponse> updateProfile(@RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok("Password changed successfully");
    }
}

package com.shelton.expense_tracker_backend.service;

import com.shelton.expense_tracker_backend.dto.auth.AuthResponse;
import com.shelton.expense_tracker_backend.dto.user.ChangePasswordRequest;
import com.shelton.expense_tracker_backend.dto.user.UpdateProfileRequest;
import com.shelton.expense_tracker_backend.dto.user.UserResponse;
import com.shelton.expense_tracker_backend.entity.User;
import com.shelton.expense_tracker_backend.repository.UserRepository;
import com.shelton.expense_tracker_backend.security.JwtUtil;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get current user profile
    public UserResponse getProfile() {
        return convertToDto(getCurrentUser());
    }

    // Update name and email
    public AuthResponse updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        if (request.getName() != null)
            user.setName(request.getName());

        boolean emailChanged = false;
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail()))
                throw new RuntimeException("Email already in use");
            user.setEmail(request.getEmail());
            emailChanged = true;
        }

        userRepository.save(user);

        // issue new token if email changed
        String token = emailChanged ? jwtUtil.generateToken(user.getEmail()) : null;

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    // Change password
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword()))
            throw new RuntimeException("Current password is incorrect");

        if (!request.getNewPassword().equals(request.getConfirmPassword()))
            throw new RuntimeException("Passwords do not match");

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private UserResponse convertToDto(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .preferredCurrency(user.getPreferredCurrency())
                .build();
    }
}

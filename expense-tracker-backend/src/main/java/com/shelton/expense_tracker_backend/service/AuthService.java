package com.shelton.expense_tracker_backend.service;

import com.shelton.expense_tracker_backend.dto.auth.AuthResponse;
import com.shelton.expense_tracker_backend.dto.auth.LoginRequest;
import com.shelton.expense_tracker_backend.dto.auth.RegisterRequest;
import com.shelton.expense_tracker_backend.entity.User;
import com.shelton.expense_tracker_backend.repository.UserRepository;
import com.shelton.expense_tracker_backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder encoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    // register user
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already in use");

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .preferredCurrency(request.getPreferredCurrency())
                .build();

        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());
        return convertToDto(user, token);
    }

    // sign in user
    public AuthResponse signin(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String token = jwtUtil.generateToken(user.getEmail());
            return convertToDto(user, token);
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        }
    }

    private AuthResponse convertToDto(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}

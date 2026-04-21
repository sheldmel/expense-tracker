package com.shelton.expense_tracker_backend.dto.auth;

import com.shelton.expense_tracker_backend.entity.Currency;
import lombok.Data;

// RegisterRequest.java
@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Currency preferredCurrency;
}

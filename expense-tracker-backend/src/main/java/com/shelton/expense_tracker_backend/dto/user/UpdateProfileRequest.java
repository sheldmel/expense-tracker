package com.shelton.expense_tracker_backend.dto.user;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String email;
}

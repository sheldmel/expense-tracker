package com.shelton.expense_tracker_backend.dto.category;

import lombok.Data;

@Data
public class CategoryRequest {

    private String name;
    private String color;
    private String icon;
}
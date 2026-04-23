package com.shelton.expense_tracker_backend.dto.budget;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {
    private Long categoryId;
    private BigDecimal limitAmount;
    private Integer month;
    private Integer year;
}
package com.shelton.expense_tracker_backend.dto.expense;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseRequest {

    private BigDecimal amount;
    private String description;
    private LocalDate date;

    private Long categoryId;
}
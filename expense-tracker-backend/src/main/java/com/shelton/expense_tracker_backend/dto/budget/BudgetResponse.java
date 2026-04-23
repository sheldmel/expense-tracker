package com.shelton.expense_tracker_backend.dto.budget;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BudgetResponse {
    private Long id;
    private String categoryName;
    private BigDecimal limitAmount;
    private Integer month;
    private Integer year;
}
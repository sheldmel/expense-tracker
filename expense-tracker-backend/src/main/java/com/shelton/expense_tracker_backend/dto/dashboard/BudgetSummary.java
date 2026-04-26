package com.shelton.expense_tracker_backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BudgetSummary {
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;
    private BigDecimal limitAmount;
    private BigDecimal spentAmount;
    private BigDecimal remaining;
    private Double percentageUsed;
}
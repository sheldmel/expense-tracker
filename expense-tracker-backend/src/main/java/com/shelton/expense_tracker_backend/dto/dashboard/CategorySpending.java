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
public class CategorySpending {
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;
    private BigDecimal total;
}

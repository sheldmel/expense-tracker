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
public class MonthlyBreakdown {
    private Integer month;
    private String monthName;
    private BigDecimal total;
}

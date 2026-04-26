package com.shelton.expense_tracker_backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecentExpense {
    private String description;
    private BigDecimal amount;
    private String categoryName;
    private String categoryColor;
    private LocalDate date;
}

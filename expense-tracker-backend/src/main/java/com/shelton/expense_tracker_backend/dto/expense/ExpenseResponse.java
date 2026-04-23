package com.shelton.expense_tracker_backend.dto.expense;

import com.shelton.expense_tracker_backend.entity.Currency;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ExpenseResponse {

    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
    private Currency userCurrency;
    private Long categoryId;
    private String categoryName;
    private String categoryIcon;
}

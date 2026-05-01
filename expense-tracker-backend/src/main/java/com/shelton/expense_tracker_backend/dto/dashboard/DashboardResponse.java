package com.shelton.expense_tracker_backend.dto.dashboard;


import com.shelton.expense_tracker_backend.dto.budget.BudgetResponse;
import com.shelton.expense_tracker_backend.dto.expense.ExpenseResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private Integer month;
    private Integer year;
    private BigDecimal totalSpent;
    private Long totalExpenses;
    private List<CategorySpending> spendingByCategory;
    private List<BudgetResponse> budgetSummary;
    private List<MonthlyBreakdown> monthlyBreakdown;
    private List<ExpenseResponse> recentExpenses;
}
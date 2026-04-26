package com.shelton.expense_tracker_backend.dto.dashboard;


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
    private List<BudgetSummary> budgetSummary;        // null for yearly
    private List<MonthlyBreakdown> monthlyBreakdown;  // null for monthly
    private List<RecentExpense> recentExpenses;
}
package com.shelton.expense_tracker_backend.service;

import com.shelton.expense_tracker_backend.dto.budget.BudgetResponse;
import com.shelton.expense_tracker_backend.dto.dashboard.*;
import com.shelton.expense_tracker_backend.dto.expense.ExpenseResponse;
import com.shelton.expense_tracker_backend.entity.Budget;
import com.shelton.expense_tracker_backend.entity.Expense;
import com.shelton.expense_tracker_backend.entity.User;
import com.shelton.expense_tracker_backend.repository.BudgetRepository;
import com.shelton.expense_tracker_backend.repository.ExpenseRepository;
import com.shelton.expense_tracker_backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final BudgetService budgetService;

    public DashboardService(ExpenseRepository expenseRepository,
                            UserRepository userRepository, BudgetService budgetService) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.budgetService = budgetService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public DashboardResponse getSummary(Integer month, Integer year) {
        Long userId = getCurrentUser().getId();
        // optional parameters
        int currentYear = year != null ? year : LocalDate.now().getYear();
        int currentMonth = month != null ? month : LocalDate.now().getMonthValue();

        if (month == null && year == null) {
            return buildMonthlySummary(userId, currentMonth, currentYear);
        }

        if (month != null) {
            return buildMonthlySummary(userId, currentMonth, currentYear);
        } else {
            return buildYearlySummary(userId, currentYear);
        }
    }

    private DashboardResponse buildMonthlySummary(Long userId, int month, int year) {
        BigDecimal totalSpent = expenseRepository.getTotalSpentByMonth(userId, month, year);
        Long totalExpenses = expenseRepository.countByMonth(userId, month, year);
        List<CategorySpending> spendingByCategory = new ArrayList<>(mapCategorySpending(
                expenseRepository.getSpendingByCategoryForMonth(userId, month, year)
        ));
        // sort by highest spending first
        spendingByCategory.sort((a, b) -> b.getTotal().compareTo(a.getTotal()));

        List<BudgetResponse> budgetSummary = budgetService.getBudgets(null, month, year);;

        // sort by most critical budget first
        budgetSummary.sort((a, b) -> Double.compare(b.getPercentageUsed(), a.getPercentageUsed()));

        List<ExpenseResponse> recentExpenses = mapRecentExpenses(
                expenseRepository.getRecentExpenses(userId)
        );

        return DashboardResponse.builder()
                .month(month)
                .year(year)
                .totalSpent(totalSpent)
                .totalExpenses(totalExpenses)
                .spendingByCategory(spendingByCategory)
                .budgetSummary(budgetSummary)
                .monthlyBreakdown(null)
                .recentExpenses(recentExpenses)
                .build();
    }

    private DashboardResponse buildYearlySummary(Long userId, int year) {
        BigDecimal totalSpent = expenseRepository.getTotalSpentByYear(userId, year);
        Long totalExpenses = expenseRepository.countByYear(userId, year);
        List<CategorySpending> spendingByCategory = mapCategorySpending(
                expenseRepository.getSpendingByCategoryForYear(userId, year)
        );
        List<MonthlyBreakdown> monthlyBreakdown = buildMonthlyBreakdown(userId, year);
        List<ExpenseResponse> recentExpenses = mapRecentExpenses(
                expenseRepository.getRecentExpenses(userId)
        );

        return DashboardResponse.builder()
                .month(null)
                .year(year)
                .totalSpent(totalSpent)
                .totalExpenses(totalExpenses)
                .spendingByCategory(spendingByCategory)
                .budgetSummary(null)
                .monthlyBreakdown(monthlyBreakdown)
                .recentExpenses(recentExpenses)
                .build();
    }

    private List<CategorySpending> mapCategorySpending(List<Object[]> rows) {
        return rows.stream().map(row -> CategorySpending.builder()
                .categoryName((String) row[0])
                .categoryColor((String) row[1])
                .categoryIcon((String) row[2])
                .total((BigDecimal) row[3])
                .build()
        ).toList();
    }

    private List<MonthlyBreakdown> buildMonthlyBreakdown(Long userId, int year) {
        List<Object[]> rows = expenseRepository.getMonthlyBreakdown(userId, year);

        // Map each row from the query result to month number -> total spent
        // row[0] is the month number, row[1] is the total amount
        Map<Integer, BigDecimal> monthMap = new HashMap<>();
        for (Object[] row : rows) {
            monthMap.put(((Number) row[0]).intValue(), (BigDecimal) row[1]);
        }

        // Build all 12 months, months with no expenses default to zero
        List<MonthlyBreakdown> result = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            result.add(MonthlyBreakdown.builder()
                    .month(m)
                    .monthName(Month.of(m).getDisplayName(TextStyle.FULL, Locale.ENGLISH))
                    .total(monthMap.getOrDefault(m, BigDecimal.ZERO))
                    .build());
        }
        return result;
    }

    private List<ExpenseResponse> mapRecentExpenses(List<Expense> expenses) {
        return expenses.stream().map(e -> ExpenseResponse.builder()
                .id(e.getId())
                .amount(e.getAmount())
                .description(e.getDescription())
                .date(e.getDate())
                .categoryName(e.getCategory().getName())
                .categoryIcon(e.getCategory().getIcon())
                .categoryColor(e.getCategory().getColor())
                .build()
        ).toList();
    }
}
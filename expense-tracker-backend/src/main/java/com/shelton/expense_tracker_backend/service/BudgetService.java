package com.shelton.expense_tracker_backend.service;

import com.shelton.expense_tracker_backend.dto.budget.BudgetRequest;
import com.shelton.expense_tracker_backend.dto.budget.BudgetResponse;
import com.shelton.expense_tracker_backend.entity.Budget;
import com.shelton.expense_tracker_backend.entity.Category;
import com.shelton.expense_tracker_backend.entity.User;
import com.shelton.expense_tracker_backend.repository.BudgetRepository;
import com.shelton.expense_tracker_backend.repository.CategoryRepository;
import com.shelton.expense_tracker_backend.repository.ExpenseRepository;
import com.shelton.expense_tracker_backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BudgetService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public BudgetService(ExpenseRepository expenseRepository, BudgetRepository budgetRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<BudgetResponse> getBudgets(Long categoryId, Integer month, Integer year) {
        Long userId = getCurrentUser().getId();
        List<Budget> budgets = budgetRepository.findBudgets(userId, categoryId, month, year);

        // get spending by category for this month/year if month and year provided
        Map<String, BigDecimal> spendingMap = new HashMap<>();
        if (month != null && year != null) {
            List<Object[]> spending = expenseRepository.getSpendingByCategoryForMonth(userId, month, year);
            for (Object[] row : spending) {
                spendingMap.put((String) row[0], (BigDecimal) row[3]);
            }
        }

        List<BudgetResponse> result = new ArrayList<>();
        for (Budget budget : budgets) {
            String categoryName = budget.getCategory().getName();
            BigDecimal spent = spendingMap.getOrDefault(categoryName, BigDecimal.ZERO);
            BigDecimal limit = budget.getLimitAmount();
            BigDecimal remaining = limit.subtract(spent);
            double percentage = spent.divide(limit, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();

            result.add(BudgetResponse.builder()
                    .id(budget.getId())
                    .categoryName(categoryName)
                    .categoryColor(budget.getCategory().getColor())
                    .categoryIcon(budget.getCategory().getIcon())
                    .limitAmount(limit)
                    .spentAmount(spent)
                    .remaining(remaining)
                    .percentageUsed(percentage)
                    .month(budget.getMonth())
                    .year(budget.getYear())
                    .build());
        }
        return result;
    }

    public BudgetResponse createBudget(BudgetRequest request) {
        User user = getCurrentUser();

        // prevent duplicate budget for same category/month/year
        budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(
                user.getId(), request.getCategoryId(), request.getMonth(), request.getYear()
        ).ifPresent(b -> {
            throw new RuntimeException("Budget already exists for this category and period");
        });

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Budget budget = Budget.builder()
                .limitAmount(request.getLimitAmount())
                .month(request.getMonth())
                .year(request.getYear())
                .category(category)
                .user(user)
                .build();

        return convertToDto(budgetRepository.save(budget));
    }

    public BudgetResponse updateBudget(Long id, BudgetRequest request) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUser().getId().equals(getCurrentUser().getId()))
            throw new RuntimeException("Unauthorized");

        budget.setLimitAmount(request.getLimitAmount());
        return convertToDto(budgetRepository.save(budget));
    }

    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUser().getId().equals(getCurrentUser().getId()))
            throw new RuntimeException("Unauthorized");

        budgetRepository.delete(budget);
    }

    private BudgetResponse convertToDto(Budget budget) {
        return BudgetResponse.builder()
                .id(budget.getId())
                .categoryName(budget.getCategory().getName())
                .categoryColor(budget.getCategory().getColor())
                .categoryIcon(budget.getCategory().getIcon())
                .limitAmount(budget.getLimitAmount())
                .spentAmount(BigDecimal.ZERO)   // no spending context on create/update
                .remaining(budget.getLimitAmount())
                .percentageUsed(0.0)
                .month(budget.getMonth())
                .year(budget.getYear())
                .build();
    }
}
package com.shelton.expense_tracker_backend.service;

import com.shelton.expense_tracker_backend.dto.budget.BudgetRequest;
import com.shelton.expense_tracker_backend.dto.budget.BudgetResponse;
import com.shelton.expense_tracker_backend.entity.Budget;
import com.shelton.expense_tracker_backend.entity.Category;
import com.shelton.expense_tracker_backend.entity.User;
import com.shelton.expense_tracker_backend.repository.BudgetRepository;
import com.shelton.expense_tracker_backend.repository.CategoryRepository;
import com.shelton.expense_tracker_backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
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
        return budgetRepository.findBudgets(userId, categoryId, month, year)
                .stream()
                .map(this::convertToDto)
                .toList();
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
                .limitAmount(budget.getLimitAmount())
                .month(budget.getMonth())
                .year(budget.getYear())
                .build();
    }
}
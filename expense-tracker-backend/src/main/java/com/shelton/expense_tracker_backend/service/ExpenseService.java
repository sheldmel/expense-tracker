package com.shelton.expense_tracker_backend.service;

import com.shelton.expense_tracker_backend.dto.category.CategoryRequest;
import com.shelton.expense_tracker_backend.dto.category.CategoryResponse;
import com.shelton.expense_tracker_backend.dto.expense.ExpenseRequest;
import com.shelton.expense_tracker_backend.dto.expense.ExpenseResponse;
import com.shelton.expense_tracker_backend.entity.Category;
import com.shelton.expense_tracker_backend.entity.Expense;
import com.shelton.expense_tracker_backend.entity.User;
import com.shelton.expense_tracker_backend.repository.CategoryRepository;
import com.shelton.expense_tracker_backend.repository.ExpenseRepository;
import com.shelton.expense_tracker_backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }
    // Helper to get the logged in
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Create a new Expense
    public ExpenseResponse createExpense(ExpenseRequest request) {
        Long userId = getCurrentUser().getId();
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Expense expense = Expense.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .date(request.getDate())
                .category(category)
                .user(User.builder().id(userId).build())
                .build();
        Expense saved = expenseRepository.save(expense);

        return convertToDto(saved);
    }

    // Get expenses within a range, by category or all
    public List<ExpenseResponse> getExpenses(
            Long categoryId,
            LocalDate startDate,
            LocalDate endDate
    ){
        Long userId = getCurrentUser().getId();
        return expenseRepository.findExpenses(userId, categoryId, startDate, endDate)
                .stream()
                .map(this::convertToDto)
                .toList();

    }

    // update an existing expense
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        // only allow expense to be updated if it belongs to the user
        if (!expense.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());
        expense.setCategory(category);

        Expense updated = expenseRepository.save(expense);

        return convertToDto(updated);
    }

    // Delete an existing expense
    public void deleteExpense(Long id) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        // only allow expense to be deleted if it belongs to the user
        if (!expense.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        expenseRepository.delete(expense);
    }


    // DTO conversion helper
    private ExpenseResponse convertToDto(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .amount(expense.getAmount())
                .description(expense.getDescription())
                .date(expense.getDate())
                .userCurrency(getCurrentUser().getPreferredCurrency())
                .categoryId(expense.getCategory().getId())
                .categoryName(expense.getCategory().getName())
                .categoryIcon(expense.getCategory().getIcon())
                .build();
    }
}

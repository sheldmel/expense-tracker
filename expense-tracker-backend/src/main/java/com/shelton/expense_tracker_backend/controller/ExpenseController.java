package com.shelton.expense_tracker_backend.controller;

import com.shelton.expense_tracker_backend.dto.category.CategoryRequest;
import com.shelton.expense_tracker_backend.dto.category.CategoryResponse;
import com.shelton.expense_tracker_backend.dto.expense.ExpenseRequest;
import com.shelton.expense_tracker_backend.dto.expense.ExpenseResponse;
import com.shelton.expense_tracker_backend.service.ExpenseService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")

public class ExpenseController {
    private final ExpenseService expenseService;


    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // Add a new Expense
    @PostMapping
    public ExpenseResponse createExpense(@RequestBody ExpenseRequest request) {
        return expenseService.createExpense(request);
    }

    // Get expenses
    @GetMapping
    public ResponseEntity<Page<ExpenseResponse>> getExpenses(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(expenseService.getExpenses(
                categoryId, startDate, endDate, sortBy, sortDir, page, size
        ));
    }

    // Update an existing expense
    @PutMapping("/{id}")
    public ExpenseResponse updateExpense(
            @PathVariable Long id,
            @RequestBody ExpenseRequest request
    ) {
        return expenseService.updateExpense(id, request);
    }

    // Delete an existing expense
    @DeleteMapping("/{id}")
    public void updateExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);;
    }

}

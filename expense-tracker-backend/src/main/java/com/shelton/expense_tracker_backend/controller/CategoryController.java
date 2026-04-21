package com.shelton.expense_tracker_backend.controller;

import com.shelton.expense_tracker_backend.dto.category.CategoryRequest;
import com.shelton.expense_tracker_backend.dto.category.CategoryResponse;
import com.shelton.expense_tracker_backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Get all categories
    @GetMapping
    public List<CategoryResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // Create a new custom category
    @PostMapping
    public CategoryResponse createCategory(@RequestBody CategoryRequest request) {
        return categoryService.createCategory(request);
    }

    // Update an existing custom category
    @PutMapping("/{id}")
    public CategoryResponse updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request
    ) {
        return categoryService.updateCategory(id, request);
    }

    // delete a custom category
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }
}
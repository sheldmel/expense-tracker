package com.shelton.expense_tracker_backend.service;

import com.shelton.expense_tracker_backend.dto.category.CategoryRequest;
import com.shelton.expense_tracker_backend.dto.category.CategoryResponse;
import com.shelton.expense_tracker_backend.entity.Category;
import com.shelton.expense_tracker_backend.repository.CategoryRepository;
import com.shelton.expense_tracker_backend.entity.User;
import com.shelton.expense_tracker_backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class CategoryService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public CategoryService(UserRepository userRepository, CategoryRepository categoryRepository) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    public List<CategoryResponse> getAllCategories() {

        Long userId = getCurrentUserId();
        System.out.println(userId);
        List<Category> categories = categoryRepository.findAllForUser(userId);

        return categories.stream()
                .map(this::convertToDto)
                .toList();
    }

    // CREATE
    public CategoryResponse createCategory(CategoryRequest request) {

        Long userId = getCurrentUserId();

        Category category = Category.builder()
                .name(request.getName())
                .color(request.getColor())
                .icon(request.getIcon())
                .user(User.builder().id(userId).build())
                .build();

        Category saved = categoryRepository.save(category);

        return convertToDto(saved);
    }

    // UPDATE
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // don't allow default categories to be updated
        if (category.getUser() == null) {
            throw new RuntimeException("Cannot modify default categories");
        }


        if (!category.getUser().getId().equals(getCurrentUserId())) {
            throw new RuntimeException("Unauthorized");
        }

        category.setName(request.getName());
        category.setColor(request.getColor());
        category.setIcon(request.getIcon());

        Category updated = categoryRepository.save(category);

        return convertToDto(updated);
    }

    // DELETE
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // don't allow default categories to be deleted
        if (category.getUser() == null) {
            throw new RuntimeException("Cannot delete default categories");
        }

        if (!category.getUser().getId().equals(getCurrentUserId())) {
            throw new RuntimeException("Unauthorized");
        }

        categoryRepository.delete(category);
    }

    // DTO helper function
    private CategoryResponse convertToDto(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .color(category.getColor())
                .icon(category.getIcon())
                .isDefault(category.getUser() == null)
                .build();
    }
}
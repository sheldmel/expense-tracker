package com.shelton.expense_tracker_backend.repository;

import com.shelton.expense_tracker_backend.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserId(Long userId);

    // For duplicate check
    Optional<Budget> findByUserIdAndCategoryIdAndMonthAndYear(
            Long userId, Long categoryId, Integer month, Integer year
    );

    @Query("""
        SELECT b FROM Budget b
        WHERE b.user.id = :userId
        AND (:categoryId IS NULL OR b.category.id = :categoryId)
        AND (:month IS NULL OR b.month = :month)
        AND (:year IS NULL OR b.year = :year)
    """)
    List<Budget> findBudgets(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("month") Integer month,
            @Param("year") Integer year
    );
}
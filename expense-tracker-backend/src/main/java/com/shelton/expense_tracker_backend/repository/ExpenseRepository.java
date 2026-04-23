package com.shelton.expense_tracker_backend.repository;

import com.shelton.expense_tracker_backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserId(Long userId);

    @Query("""
    SELECT e FROM Expense e
                    WHERE e.user.id = :userId
                    AND (:categoryId IS NULL OR e.category.id = :categoryId)
                    AND (CAST(:startDate AS date) IS NULL OR e.date >= :startDate)
                    AND (CAST(:endDate AS date) IS NULL OR e.date <= :endDate)
                    ORDER BY e.date DESC
""")
    List<Expense> findExpenses(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}

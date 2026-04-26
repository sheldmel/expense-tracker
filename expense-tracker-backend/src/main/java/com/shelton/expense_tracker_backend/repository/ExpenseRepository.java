package com.shelton.expense_tracker_backend.repository;

import com.shelton.expense_tracker_backend.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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
    """)
    Page<Expense> findExpenses(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND MONTH(e.date) = :month AND YEAR(e.date) = :year")
    BigDecimal getTotalSpentByMonth(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND YEAR(e.date) = :year")
    BigDecimal getTotalSpentByYear(@Param("userId") Long userId, @Param("year") int year);

    @Query("SELECT COUNT(e) FROM Expense e WHERE e.user.id = :userId AND MONTH(e.date) = :month AND YEAR(e.date) = :year")
    Long countByMonth(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

    @Query("SELECT COUNT(e) FROM Expense e WHERE e.user.id = :userId AND YEAR(e.date) = :year")
    Long countByYear(@Param("userId") Long userId, @Param("year") int year);

    @Query("""
                SELECT e.category.name, e.category.color, e.category.icon, SUM(e.amount)
                FROM Expense e
                WHERE e.user.id = :userId AND MONTH(e.date) = :month AND YEAR(e.date) = :year
                GROUP BY e.category.name, e.category.color, e.category.icon
    """)
    List<Object[]> getSpendingByCategoryForMonth(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

    @Query("""
                SELECT e.category.name, e.category.color, e.category.icon, SUM(e.amount)
                FROM Expense e
                WHERE e.user.id = :userId AND YEAR(e.date) = :year
                GROUP BY e.category.name, e.category.color, e.category.icon
    """)
    List<Object[]> getSpendingByCategoryForYear(@Param("userId") Long userId, @Param("year") int year);

    @Query("""
                SELECT MONTH(e.date), SUM(e.amount)
                FROM Expense e
                WHERE e.user.id = :userId AND YEAR(e.date) = :year
                GROUP BY MONTH(e.date)
                ORDER BY MONTH(e.date)
    """)
    List<Object[]> getMonthlyBreakdown(@Param("userId") Long userId, @Param("year") int year);

    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId ORDER BY e.date DESC LIMIT 5")
    List<Expense> getRecentExpenses(@Param("userId") Long userId);
}

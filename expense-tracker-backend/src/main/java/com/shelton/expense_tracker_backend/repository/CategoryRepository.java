package com.shelton.expense_tracker_backend.repository;

import com.shelton.expense_tracker_backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("""
        SELECT c FROM Category c
        WHERE c.user.id = :userId OR c.user IS NULL
    """)
    List<Category> findAllForUser(Long userId);
}

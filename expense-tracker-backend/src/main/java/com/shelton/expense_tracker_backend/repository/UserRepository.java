package com.shelton.expense_tracker_backend.repository;

import com.shelton.expense_tracker_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find user by name
    Optional<User> findByName(String name);

    // CHeck if user with email exists
    boolean existsByEmail(String email);
}


package com.example.homewalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.homewalk.entity.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Users findByUsernameAndPassword(String username, String password);
    Users findByUsername(String username);
    Users findByUserId(Long userId);
}

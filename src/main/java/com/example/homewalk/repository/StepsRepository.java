package com.example.homewalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.homewalk.entity.Steps;

import java.util.List;

public interface StepsRepository extends JpaRepository<Steps, Long> {
    List<Steps> findByUserId(Long userId);
}
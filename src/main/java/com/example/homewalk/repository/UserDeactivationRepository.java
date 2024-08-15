package com.example.homewalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.homewalk.entity.UserDeactivation;

public interface UserDeactivationRepository extends JpaRepository<UserDeactivation, Long> {
}

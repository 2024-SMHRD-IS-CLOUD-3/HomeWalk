package com.example.homewalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.homewalk.entity.DeactivationReason;

public interface DeactivationReasonRepository extends JpaRepository<DeactivationReason, Long> {
}


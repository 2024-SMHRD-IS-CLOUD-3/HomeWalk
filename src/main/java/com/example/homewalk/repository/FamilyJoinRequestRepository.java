package com.example.homewalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.homewalk.entity.FamilyJoinRequest;

public interface FamilyJoinRequestRepository extends JpaRepository<FamilyJoinRequest, Long> {
}

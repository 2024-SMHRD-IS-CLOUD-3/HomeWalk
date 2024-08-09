package com.example.homewalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.homewalk.entity.FamilyJoinRequest;
import java.util.Optional;

public interface FamilyJoinRequestRepository extends JpaRepository<FamilyJoinRequest, Long> {
    Optional<FamilyJoinRequest> findByUserIdAndFamilyId(Long userId, Long familyId);
    void deleteByUserIdAndFamilyId(Long userId, Long familyId);
}

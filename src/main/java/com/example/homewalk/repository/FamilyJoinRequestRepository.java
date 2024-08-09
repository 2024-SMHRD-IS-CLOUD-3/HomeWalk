package com.example.homewalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.homewalk.entity.FamilyJoinRequest;
import java.util.Optional;
import java.util.List;

public interface FamilyJoinRequestRepository extends JpaRepository<FamilyJoinRequest, Long> {
    Optional<FamilyJoinRequest> findByUserIdAndFamilyId(Long userId, Long familyId);
    void deleteByUserIdAndFamilyId(Long userId, Long familyId);
    
    // 여러 가족 ID에 대한 가입 신청 목록 가져오기
    List<FamilyJoinRequest> findByFamilyIdIn(List<Long> familyIds);
}

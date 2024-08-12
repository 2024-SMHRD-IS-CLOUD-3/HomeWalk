package com.example.homewalk.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.homewalk.entity.FamilyMembers;

public interface FamilyMembersRepository extends JpaRepository<FamilyMembers, Long> {
	List<FamilyMembers> findByFamilyId(Long familyId);
	List<FamilyMembers> findByUserId(Long userId);
	
	// 특정 사용자와 가족 ID를 기반으로 가족에서 해당 사용자를 제거
    void deleteByUserIdAndFamilyId(Long userId, Long familyId);
    
    // 특정 사용자와 가족 ID로 가족 멤버 조회
    Optional<FamilyMembers> findByUserIdAndFamilyId(Long userId, Long familyId);
}

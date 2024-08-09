package com.example.homewalk.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.homewalk.entity.FamilyMembers;

public interface FamilyMembersRepository extends JpaRepository<FamilyMembers, Long> {
	List<FamilyMembers> findByFamilyId(Long familyId);
}

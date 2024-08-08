package com.example.homewalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.homewalk.entity.FamilyMembers;

public interface FamilyMembersRepository extends JpaRepository<FamilyMembers, Long> {
}

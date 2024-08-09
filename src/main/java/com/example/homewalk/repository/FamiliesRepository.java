package com.example.homewalk.repository;

import com.example.homewalk.entity.Families;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FamiliesRepository extends JpaRepository<Families, Long> {
	List<Families> findByCreatorId(Long creatorId);
}
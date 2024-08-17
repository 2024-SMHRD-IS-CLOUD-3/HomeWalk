package com.example.homewalk.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.homewalk.dto.DeactivationStatisticsDto;
import com.example.homewalk.entity.UserDeactivation;

public interface UserDeactivationRepository extends JpaRepository<UserDeactivation, Long> {
	@Query("SELECT new com.example.homewalk.dto.DeactivationStatisticsDto(r.reasonText, COUNT(d)) "
			+ "FROM UserDeactivation d JOIN d.reason r " + "GROUP BY r.reasonText")
	List<DeactivationStatisticsDto> findDeactivationStatistics();
}

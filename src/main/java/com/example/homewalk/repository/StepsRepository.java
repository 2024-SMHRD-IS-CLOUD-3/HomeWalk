package com.example.homewalk.repository;

import com.example.homewalk.dto.RankingDTO;
import com.example.homewalk.entity.Steps;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StepsRepository extends JpaRepository<Steps, Long> {

	// 기존 메서드들은 그대로 유지

	List<Steps> findByUserIdAndDate(Long userId, LocalDate date);

	List<Steps> findByUserId(Long userId);

	List<Steps> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

	// findTop3ByOrderByStepsCountDesc 메서드 수정
	@Query("SELECT new com.example.homewalk.dto.RankingDTO(s.userId, '', 0, SUM(s.stepsCount)) " + "FROM Steps s "
			+ "GROUP BY s.userId " + "ORDER BY SUM(s.stepsCount) DESC")
	List<RankingDTO> findTop3ByOrderByStepsCountDesc();

	// findRankingByUserId 메서드 수정
	@Query("SELECT new com.example.homewalk.dto.RankingDTO(s.userId, '', 0, SUM(s.stepsCount)) " + "FROM Steps s "
			+ "WHERE s.userId = :userId " + "GROUP BY s.userId")
	RankingDTO findRankingByUserId(@Param("userId") Long userId);

	// findAllByOrderByStepsCountDesc 메서드 수정
	@Query("SELECT new com.example.homewalk.dto.RankingDTO(s.userId, '', 0, SUM(s.stepsCount)) " + "FROM Steps s "
			+ "GROUP BY s.userId " + "ORDER BY SUM(s.stepsCount) DESC")
	List<RankingDTO> findAllByOrderByStepsCountDesc();

	interface RankingProjection {
		Long getUserId();

		String getUsername();

		Integer getRanking();

		Long getStepsCount(); // Integer에서 Long으로 변경
	}
}
package com.example.homewalk.repository;

import com.example.homewalk.dto.UserRankingDTO;
import com.example.homewalk.entity.Leaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaderboardRepository extends JpaRepository<Leaderboard, Long> {

	// 상위 3명의 순위와 걸음 수를 가져오는 쿼리 (LIMIT 3)
    @Query("SELECT new com.example.homewalk.dto.UserRankingDTO(l.user.id, u.username, l.totalSteps, l.ranking) " +
           "FROM Leaderboard l JOIN Users u ON l.user.id = u.id " +
           "ORDER BY l.totalSteps DESC")
    List<UserRankingDTO> findTop3ByOrderByTotalStepsDesc();

    // 특정 사용자의 순위를 가져오는 쿼리
    @Query("SELECT new com.example.homewalk.dto.UserRankingDTO(l.user.id, u.username, l.totalSteps, l.ranking) " +
           "FROM Leaderboard l JOIN Users u ON l.user.id = u.id " +
           "WHERE l.user.id = :userId")
    UserRankingDTO findRankingByUserId(Long userId);

    // 상위 3명만 가져오는 쿼리 수정
    @Query(value = "SELECT new com.example.homewalk.dto.UserRankingDTO(l.user.id, u.username, l.totalSteps, l.ranking) " +
                   "FROM Leaderboard l JOIN Users u ON l.user.id = u.id " +
                   "ORDER BY l.totalSteps DESC")
    List<UserRankingDTO> findTop3ByOrderByTotalStepsDescWithLimit();
}

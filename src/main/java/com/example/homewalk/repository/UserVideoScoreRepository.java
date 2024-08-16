package com.example.homewalk.repository;

import com.example.homewalk.entity.UserVideoScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserVideoScoreRepository extends JpaRepository<UserVideoScore, Long> {
    List<UserVideoScore> findByUserIdOrderByRecordDateAsc(Long userId);
}

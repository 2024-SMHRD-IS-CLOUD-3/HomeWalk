package com.example.homewalk.repository;

import com.example.homewalk.entity.Steps;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StepsRepository extends JpaRepository<Steps, Long> {
    
    // 특정 사용자 ID와 날짜를 기준으로 걸음수 데이터를 조회
    List<Steps> findByUserIdAndDate(Long userId, LocalDate date);

    // 특정 사용자 ID로 모든 걸음수 데이터를 조회
    List<Steps> findByUserId(Long userId);
    
    List<Steps> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}

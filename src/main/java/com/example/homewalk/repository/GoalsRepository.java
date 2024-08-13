package com.example.homewalk.repository;

import com.example.homewalk.entity.Goals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalsRepository extends JpaRepository<Goals, Long> {

    // 사용자 ID 리스트와 목표 유형(weekly)에 따른 목표 리스트를 반환하는 쿼리 메서드
    List<Goals> findByUserIdInAndGoalType(List<Long> userIds, String goalType);
}

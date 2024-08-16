package com.example.homewalk.service;

import com.example.homewalk.entity.Goals;
import com.example.homewalk.repository.GoalsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GoalsService {

    @Autowired
    private GoalsRepository goalsRepository;

    
    // 특정 사용자들의 주간 목표를 가져오는 메서드
    public List<Goals> getWeeklyGoalsForUsers(List<Long> userIds) {
        return goalsRepository.findByUserIdInAndGoalType(userIds, "weekly");
    }
    

    public Goals saveGoal(Long userId, String goalType, int goalValue) {
        // 사용자 ID와 목표 유형에 따라 기존 목표가 있는지 확인
        Optional<Goals> existingGoalOpt = goalsRepository.findByUserIdAndGoalType(userId, goalType);

        Goals goal;
        if (existingGoalOpt.isPresent()) {
            // 기존 목표가 있다면 값을 업데이트
            goal = existingGoalOpt.get();
            goal.setGoalValue(goalValue);
        } else {
            // 기존 목표가 없다면 새로운 목표 생성
            goal = new Goals();
            goal.setUserId(userId);
            goal.setGoalType(goalType);
            goal.setGoalValue(goalValue);
            goal.setAchieved(false); // 목표가 달성되지 않은 상태로 설정
        }

        // Goals 엔티티를 데이터베이스에 저장 (업데이트 또는 삽입)
        return goalsRepository.save(goal);
    }

    public Goals saveWeeklyGoal(Long userId, int weeklyGoalValue) {
        return saveGoal(userId, "weekly", weeklyGoalValue);
    }

    public Goals saveMonthlyGoal(Long userId, int monthlyGoalValue) {
        return saveGoal(userId, "monthly", monthlyGoalValue);
    }
    
 // 특정 사용자의 주간 목표를 가져오는 메서드
    public Goals getWeeklyGoal(Long userId) {
        return goalsRepository.findByUserIdAndGoalType(userId, "weekly").orElse(null);
    }

    // 특정 사용자의 월간 목표를 가져오는 메서드
    public Goals getMonthlyGoal(Long userId) {
        return goalsRepository.findByUserIdAndGoalType(userId, "monthly").orElse(null);
    }
}
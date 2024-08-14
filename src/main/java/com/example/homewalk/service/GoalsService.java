package com.example.homewalk.service;

import com.example.homewalk.entity.Goals;
import com.example.homewalk.repository.GoalsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalsService {

    @Autowired
    private GoalsRepository goalsRepository;

    
    // 특정 사용자들의 주간 목표를 가져오는 메서드
    public List<Goals> getWeeklyGoalsForUsers(List<Long> userIds) {
        return goalsRepository.findByUserIdInAndGoalType(userIds, "weekly");
    }
    

    public Goals saveGoal(Long userId, String goalType, int goalValue) {
        // Goals 엔티티 생성
        Goals goal = new Goals();
        goal.setUserId(userId);
        goal.setGoalType(goalType);
        goal.setGoalValue(goalValue);
        goal.setAchieved(false); // 목표가 달성되지 않은 상태로 설정
        
        System.out.println("goal" + goal);

        // Goals 엔티티를 데이터베이스에 저장
        Goals savedGoal = goalsRepository.save(goal);
        System.out.println("savedGoal" + savedGoal);

        return savedGoal;
    }

    public Goals saveWeeklyGoal(Long userId, int weeklyGoalValue) {
        return saveGoal(userId, "weeklyGoal", weeklyGoalValue);
    }

    public Goals saveMonthlyGoal(Long userId, int monthlyGoalValue) {
        return saveGoal(userId, "monthlyGoal", monthlyGoalValue);
    }
}
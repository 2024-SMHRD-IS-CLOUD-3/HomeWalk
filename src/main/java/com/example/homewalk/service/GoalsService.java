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
}

package com.example.homewalk.controller;

import com.example.homewalk.entity.Goals;
import com.example.homewalk.service.GoalsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalsController {

    @Autowired
    private GoalsService goalsService;

    // 특정 사용자들의 주간 목표를 가져오는 API
    @PostMapping("/weekly")
    public ResponseEntity<List<Goals>> getWeeklyGoalsForUsers(@RequestBody Map<String, List<Long>> request) {
        List<Long> userIds = request.get("userIds");
        List<Goals> weeklyGoals = goalsService.getWeeklyGoalsForUsers(userIds);
        return ResponseEntity.ok(weeklyGoals);
    }
}

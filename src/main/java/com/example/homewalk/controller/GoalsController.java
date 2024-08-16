package com.example.homewalk.controller;

import com.example.homewalk.dto.GoalsDTO;
import com.example.homewalk.entity.Goals;
import com.example.homewalk.service.GoalsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
    
    // 특정 사용자의 주간 및 월간 목표를 가져오는 API
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Integer>> getGoalsForUser(@PathVariable Long userId) {
        Goals weeklyGoalEntity = goalsService.getWeeklyGoal(userId);
        Goals monthlyGoalEntity = goalsService.getMonthlyGoal(userId);

        int weeklyGoal = (weeklyGoalEntity != null) ? weeklyGoalEntity.getGoalValue() : 0;
        int monthlyGoal = (monthlyGoalEntity != null) ? monthlyGoalEntity.getGoalValue() : 0;

        Map<String, Integer> response = new HashMap<>();
        response.put("weekly", weeklyGoal);
        response.put("monthly", monthlyGoal);

        return ResponseEntity.ok(response);
    }
    
    // 주간 목표 저장 API
    @PostMapping("/save/weekly")
    public ResponseEntity<String> saveWeeklyGoal(@RequestBody GoalsDTO goalsDTO) {
        try {
            Goals savedGoal = goalsService.saveWeeklyGoal(goalsDTO.getUserId(), goalsDTO.getGoalValue());
            return ResponseEntity.ok("Weekly goal saved successfully: " + savedGoal.getGoalId());
        } catch (Exception e) {
           System.out.println(e);
            return ResponseEntity.status(500).body("Failed to save weekly goal.");
        }
    }

    // 월간 목표 저장 API
    @PostMapping("/save/monthly")
    public ResponseEntity<String> saveMonthlyGoal(@RequestBody GoalsDTO goalsDTO) {
        try {
            Goals savedGoal = goalsService.saveMonthlyGoal(goalsDTO.getUserId(), goalsDTO.getGoalValue());
            return ResponseEntity.ok("Monthly goal saved successfully: " + savedGoal.getGoalId());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to save monthly goal.");
        }
    }
}

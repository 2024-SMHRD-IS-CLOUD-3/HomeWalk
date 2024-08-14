package com.example.homewalk.controller;

import com.example.homewalk.dto.GoalsDTO;
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
    
    // 주간 목표 저장 API
    @PostMapping("/save/weekly")
    public ResponseEntity<String> saveWeeklyGoal(@RequestBody GoalsDTO goalsDTO) {
        try {
           System.out.println("goalsDTO" + goalsDTO);
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

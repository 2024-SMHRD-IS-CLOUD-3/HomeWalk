package com.example.homewalk.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.homewalk.entity.Steps;
import com.example.homewalk.service.StepsService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/steps")
public class StepsController {

    @Autowired
    private StepsService stepsService;

    // 사용자의 모든 걸음 수 데이터 가져오기
    @GetMapping("/{userId}")
    public List<Steps> getStepsByUserId(@PathVariable Long userId) {
        return stepsService.getStepsByUserId(userId);
    }

    // 사용자의 오늘 걸음 수 데이터 가져오기
    @GetMapping("/{userId}/today")
    public Steps getTodayStepsByUserId(@PathVariable Long userId) {
        return stepsService.getTodaySteps(userId);
    }

    // 사용자의 어제 걸음 수 데이터 가져오기
    @GetMapping("/{userId}/yesterday")
    public Steps getYesterdayStepsByUserId(@PathVariable Long userId) {
        return stepsService.getYesterdaySteps(userId);
    }

    // 사용자의 오늘과 어제 걸음 수 데이터를 모두 가져오기
    @GetMapping("/{userId}/comparison")
    public Map<String, Steps> getStepsComparison(@PathVariable Long userId) {
        Map<String, Steps> stepsComparison = new HashMap<>();
        stepsComparison.put("todaySteps", stepsService.getTodaySteps(userId));
        stepsComparison.put("yesterdaySteps", stepsService.getYesterdaySteps(userId));
        return stepsComparison;
    }
}

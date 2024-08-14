package com.example.homewalk.dto;

import lombok.Data;

@Data
public class GoalsDTO {
    private Long userId;        // 사용자의 ID
    private String goalType;    // 목표 유형 ("weeklyGoal" 또는 "monthlyGoal")
    private int goalValue;      // 목표 걸음 수
    private boolean achieved;   // 목표 달성 여부 (기본값은 false)

}
         

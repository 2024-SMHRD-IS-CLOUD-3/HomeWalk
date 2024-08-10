package com.example.homewalk.controller;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String jwt;
    private String username;
    private String email;
    private String avatarCustomization;
    private int dailyStepGoal;
    private int weeklyStepGoal;
    private int monthlyStepGoal;
    private boolean isActive;
}

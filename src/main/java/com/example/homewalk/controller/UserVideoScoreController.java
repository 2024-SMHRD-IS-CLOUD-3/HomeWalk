package com.example.homewalk.controller;

import com.example.homewalk.entity.UserVideoScore;
import com.example.homewalk.service.UserVideoScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserVideoScoreController {

    @Autowired
    private UserVideoScoreService userVideoScoreService;

    @GetMapping("/scores")
    public List<UserVideoScore> getUserScores(@RequestParam Long userId) {
        return userVideoScoreService.getUserScores(userId);
    }
}

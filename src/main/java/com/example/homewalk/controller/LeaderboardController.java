package com.example.homewalk.controller;

import com.example.homewalk.dto.LeaderboardDTO;
import com.example.homewalk.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<LeaderboardDTO> getLeaderboard(@RequestParam Long userId) {
        LeaderboardDTO leaderboardDTO = leaderboardService.getLeaderboardData(userId);
        return ResponseEntity.ok(leaderboardDTO);
    }

}

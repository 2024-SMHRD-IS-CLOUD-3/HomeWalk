package com.example.homewalk.controller;

import com.example.homewalk.dto.RankingDTO;
import com.example.homewalk.service.RankingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ranking")
public class RankingController {

    @Autowired
    private RankingService rankingService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRanking(@RequestParam Long userId) {
        List<RankingDTO> topRanking = rankingService.getTopThreeRanking();
        RankingDTO currentUserRanking = rankingService.getUserRanking(userId);
        int totalUsers = rankingService.getTotalUsers();
        
        Map<String, Object> response = new HashMap<>();
        response.put("topRanking", topRanking);
        response.put("currentUserRanking", currentUserRanking);
        response.put("totalUsers", totalUsers);
        
        return ResponseEntity.ok(response);
    }
}
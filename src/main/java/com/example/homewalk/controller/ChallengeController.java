package com.example.homewalk.controller;

import com.example.homewalk.entity.Challenge;
import com.example.homewalk.service.ChallengeService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;
    
    @GetMapping
    public List<Challenge> getAllChallenges() {
        return challengeService.getAllChallenges();
    }
    
    @GetMapping("/current")
    public List<Challenge> getCurrentChallenges(@RequestParam String userId) {
        return challengeService.getCurrentChallenges(userId);
    }

    @GetMapping("/available")
    public List<Challenge> getAvailableChallenges(@RequestParam String userId) {
        return challengeService.getAvailableChallenges(userId);
    }

    @PostMapping
    public Challenge createChallenge(@RequestBody Challenge challenge) {
        return challengeService.createChallengeWithParticipant(challenge);
    }
}

package com.example.homewalk.controller;

import com.example.homewalk.entity.Challenge;
import com.example.homewalk.entity.ChallengeParticipant;
import com.example.homewalk.service.ChallengeService;

import java.util.List;
import java.util.Map;

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
    public List<Challenge> getCurrentChallenges(@RequestParam Long userId) {
        return challengeService.getCurrentChallenges(userId);
    }

    @GetMapping("/available")
    public List<Challenge> getAvailableChallenges(@RequestParam Long userId) {
        return challengeService.getAvailableChallenges(userId);
    }
    
    // 완료된 챌린지 가져오기
    @GetMapping("/completed")
    public List<Challenge> getCompletedChallenges(@RequestParam Long userId) {
        return challengeService.getCompletedChallenges(userId);
    }

    @PostMapping
    public Challenge createChallenge(@RequestBody Challenge challenge) {
    	System.out.println("challenge" + challenge);
        return challengeService.createChallengeWithParticipant(challenge);
    }
    
    // 새로운 참여 기능 추가
    @PostMapping("/{challengeId}/join")
    public ChallengeParticipant joinChallenge(@PathVariable Long challengeId, @RequestParam Long userId) {
        return challengeService.addParticipantToChallenge(challengeId, userId);
    }
    
    // 챌린지에서 나가기 기능 추가
    @DeleteMapping("/{challengeId}/leave")
    public void leaveChallenge(@PathVariable Long challengeId, @RequestParam Long userId) {
        challengeService.leaveChallenge(challengeId, userId);
    }
    
    @PatchMapping("/{challengeId}/achievement")
    public void updateChallengeAchievement(@PathVariable Long challengeId, @RequestParam Long userId, @RequestBody Map<String, Boolean> payload) {
        boolean achieved = payload.get("achieved");
        challengeService.updateChallengeAchievement(challengeId, userId, achieved);
    }
    
    @DeleteMapping("/{challengeId}")
    public void deleteChallenge(@PathVariable Long challengeId) {
        challengeService.deleteChallenge(challengeId);
    }
}

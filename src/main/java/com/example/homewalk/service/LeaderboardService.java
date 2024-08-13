package com.example.homewalk.service;

import com.example.homewalk.dto.LeaderboardDTO;
import com.example.homewalk.dto.UserRankingDTO;
import com.example.homewalk.repository.LeaderboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaderboardService {

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    public LeaderboardDTO getLeaderboardData(Long userId) {
        List<UserRankingDTO> top3 = leaderboardRepository.findTop3ByOrderByTotalStepsDesc();
        UserRankingDTO currentUser = leaderboardRepository.findRankingByUserId(userId);
        
        return new LeaderboardDTO(top3, currentUser);
    }
}

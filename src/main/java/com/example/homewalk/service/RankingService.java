package com.example.homewalk.service;

import com.example.homewalk.dto.RankingDTO;
import com.example.homewalk.repository.StepsRepository;
import com.example.homewalk.repository.UsersRepository;
import com.example.homewalk.entity.Users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class RankingService {

    @Autowired
    private StepsRepository stepsRepository;

    @Autowired
    private UsersRepository usersRepository;

    public List<RankingDTO> getTopThreeRanking() {
        List<RankingDTO> topThree = stepsRepository.findTop3ByOrderByStepsCountDesc();
        AtomicInteger rank = new AtomicInteger(1);
        return topThree.stream()
                .map(dto -> {
                    dto.setRanking(rank.getAndIncrement());
                    return enrichWithUsername(dto);
                })
                .limit(3) // 상위 3명만 반환
                .collect(Collectors.toList());
    }

    public RankingDTO getUserRanking(Long userId) {
        List<RankingDTO> allRankings = stepsRepository.findAllByOrderByStepsCountDesc();

        for (int i = 0; i < allRankings.size(); i++) {
            if (allRankings.get(i).getUserId().equals(userId)) {
                RankingDTO userRanking = allRankings.get(i);
                userRanking.setRanking(i + 1);
                return enrichWithUsername(userRanking);
            }
        }

        return null;
    }

    public int getTotalUsers() {
        return (int) usersRepository.count();
    }

    private RankingDTO enrichWithUsername(RankingDTO rankingDTO) {
        Users user = usersRepository.findById(rankingDTO.getUserId()).orElse(null);
        if (user != null) {
            rankingDTO.setUsername(user.getUsername());
        }
        return rankingDTO;
    }
}
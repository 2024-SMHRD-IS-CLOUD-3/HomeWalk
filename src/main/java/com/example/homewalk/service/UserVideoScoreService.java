package com.example.homewalk.service;

import com.example.homewalk.entity.UserVideoScore;
import com.example.homewalk.repository.UserVideoScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserVideoScoreService {

    @Autowired
    private UserVideoScoreRepository userVideoScoreRepository;

    public List<UserVideoScore> getUserScores(Long userId) {
        return userVideoScoreRepository.findByUserIdOrderByRecordDateAsc(userId);
    }
}

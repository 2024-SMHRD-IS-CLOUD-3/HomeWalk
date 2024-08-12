package com.example.homewalk.service;

import com.example.homewalk.entity.Steps;
import com.example.homewalk.repository.StepsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StepsService {

    @Autowired
    private StepsRepository stepsRepository;

    public List<Steps> getStepsByUserId(Long userId) {
        return stepsRepository.findByUserId(userId);
    }

    public Steps getStepsByUserIdAndDate(Long userId, LocalDate date) {
        return stepsRepository.findByUserIdAndDate(userId, date)
                              .stream().findFirst().orElse(null);
    }

    public Steps getTodaySteps(Long userId) {
        LocalDate today = LocalDate.now();
        return getStepsByUserIdAndDate(userId, today);
    }

    public Steps getYesterdaySteps(Long userId) {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        return getStepsByUserIdAndDate(userId, yesterday);
    }
}

package com.example.homewalk.service;

import com.example.homewalk.dto.StepData;
import com.example.homewalk.entity.Steps;
import com.example.homewalk.repository.StepsRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    

    public List<StepData> getWeeklyStepsData(Long userId) {
        LocalDate now = LocalDate.now();
        LocalDate startOfWeek = now.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = now.with(DayOfWeek.SUNDAY); // 이번 주의 일요일 날짜 가져오기

        List<Steps> weeklySteps = stepsRepository.findByUserIdAndDateBetween(userId, startOfWeek, endOfWeek);

        // 요일별 기본 값 설정
        Map<String, Integer> stepsMap = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            stepsMap.put(day.name(), 0);
        }

        // 데이터 채우기
        weeklySteps.forEach(step -> {
            String dayOfWeek = step.getDate().getDayOfWeek().name();
            stepsMap.put(dayOfWeek, stepsMap.get(dayOfWeek) + step.getStepsCount());
        });

        // 결과 리스트 생성
        return stepsMap.entrySet().stream()
                .map(entry -> new StepData(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparingInt(entry -> DayOfWeek.valueOf(entry.getDayOfWeek()).getValue()))
                .collect(Collectors.toList());
    }



}

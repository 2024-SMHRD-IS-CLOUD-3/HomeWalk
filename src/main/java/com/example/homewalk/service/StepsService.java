package com.example.homewalk.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.homewalk.entity.Steps;
import com.example.homewalk.repository.StepsRepository;

import java.util.List;

@Service
public class StepsService {
    @Autowired
    private StepsRepository stepsRepository;

    public List<Steps> getStepsByUserId(Long userId) {
        return stepsRepository.findByUserId(userId);
    }
}
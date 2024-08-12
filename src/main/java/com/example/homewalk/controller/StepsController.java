package com.example.homewalk.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.homewalk.entity.Steps;
import com.example.homewalk.service.StepsService;

import java.util.List;

@RestController
@RequestMapping("/api/steps")
public class StepsController {
    @Autowired
    private StepsService stepsService;

    @GetMapping("/{userId}")
    public List<Steps> getStepsByUserId(@PathVariable Long userId) {
        return stepsService.getStepsByUserId(userId);
    }
}

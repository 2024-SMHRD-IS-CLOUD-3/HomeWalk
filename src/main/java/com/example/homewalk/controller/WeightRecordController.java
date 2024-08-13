package com.example.homewalk.controller;

import com.example.homewalk.entity.WeightRecord;
import com.example.homewalk.service.WeightRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weight")
public class WeightRecordController {

    @Autowired
    private WeightRecordService weightRecordService;

    @PostMapping
    public WeightRecord saveWeightRecord(@RequestParam Long userId, @RequestParam double weight) {
        return weightRecordService.saveWeightRecord(userId, weight);
    }

    @GetMapping("/{userId}")
    public List<WeightRecord> getWeightRecordsByUserId(@PathVariable Long userId) {
        return weightRecordService.getWeightRecordsByUserId(userId);
    }
}

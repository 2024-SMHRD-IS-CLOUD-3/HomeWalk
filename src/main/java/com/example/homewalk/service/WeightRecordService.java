package com.example.homewalk.service;

import com.example.homewalk.entity.WeightRecord;
import com.example.homewalk.repository.WeightRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WeightRecordService {
    
    @Autowired
    private WeightRecordRepository weightRecordRepository;

    public WeightRecord saveWeightRecord(Long userId, double weight) {
        WeightRecord weightRecord = new WeightRecord();
        weightRecord.setUserId(userId);
        weightRecord.setDate(LocalDate.now());
        weightRecord.setWeight(weight);
        return weightRecordRepository.save(weightRecord);
    }

    public List<WeightRecord> getWeightRecordsByUserId(Long userId) {
        return weightRecordRepository.findByUserIdOrderByDateAsc(userId);
    }
}

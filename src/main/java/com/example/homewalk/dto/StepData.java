package com.example.homewalk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StepData {
    private String dayOfWeek;
    private int stepsCount;
}

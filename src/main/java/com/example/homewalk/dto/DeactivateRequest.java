package com.example.homewalk.dto;

import lombok.Data;

@Data
public class DeactivateRequest {
    private Long reasonId;
    private String comments;
}


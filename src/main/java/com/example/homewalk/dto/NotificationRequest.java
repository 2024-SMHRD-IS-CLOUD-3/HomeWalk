package com.example.homewalk.dto;

import lombok.Data;

@Data
public class NotificationRequest {
    private Long userId;
    private String message;
}


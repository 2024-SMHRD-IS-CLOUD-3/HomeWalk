package com.example.homewalk.dto;

import lombok.Data;

@Data
public class LikeToggleRequest {
    private Long userId;
    private Long postId;

}

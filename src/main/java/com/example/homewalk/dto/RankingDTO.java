package com.example.homewalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RankingDTO {
    private Long userId;
    private String username;  // 이 필드는 나중에 서비스 레이어에서 채워질 수 있습니다.
    private Integer ranking;
    private Long totalSteps;
}
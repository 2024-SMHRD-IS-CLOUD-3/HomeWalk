package com.example.homewalk.dto;

import lombok.Data;

@Data
public class DeactivationStatisticsDto {
    private String reasonText;
    private Long count;

    public DeactivationStatisticsDto(String reasonText, Long count) {  // 생성자 수정
        this.reasonText = reasonText;
        this.count = count;
    }
}

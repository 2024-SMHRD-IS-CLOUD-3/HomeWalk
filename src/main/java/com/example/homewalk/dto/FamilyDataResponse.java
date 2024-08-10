package com.example.homewalk.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FamilyDataResponse {

    private Long familyId;
    private String familyName;
    private LocalDate createdDate;
    private String creatorName;
    private List<Map<String, Object>> memberDetails;  // 가족 구성원 정보 저장할 필드

}

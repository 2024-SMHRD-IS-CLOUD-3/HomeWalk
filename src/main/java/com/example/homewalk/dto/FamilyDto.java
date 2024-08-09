package com.example.homewalk.dto;

import com.example.homewalk.entity.Families;

import lombok.Data;

@Data
public class FamilyDto {
    private Long familyId;
    private String familyName;
    private Long creatorId; // 새로 추가된 필드
    private String creatorName;
    private boolean joinRequested;

    public FamilyDto(Families family) {
        this.familyId = family.getFamilyId();
        this.familyName = family.getFamilyName();
        this.creatorName = family.getCreatorName();
    }
}
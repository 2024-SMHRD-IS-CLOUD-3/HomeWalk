package com.example.homewalk.dto;

import java.util.List;

import com.example.homewalk.entity.Families;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class FamilyDto {
    private Long familyId;
    private String familyName;
    private Long creatorId; // 새로 추가된 필드
    private String creatorName;
    private boolean joinRequested;
    @JsonProperty("isMember")
    private boolean isMember; // 사용자가 해당 가족에 가입되어 있는지 여부
    
    private List<String> members; // 구성원 목록

    public FamilyDto(Families family) {
        this.familyId = family.getFamilyId();
        this.familyName = family.getFamilyName();
        this.creatorName = family.getCreatorName();
    }
    
    public List<String> getMembers() {
        return members;
    }
    
    public void setIsMember(boolean isMember) {
        this.isMember = isMember;
    }
}

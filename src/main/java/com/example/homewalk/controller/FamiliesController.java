package com.example.homewalk.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.homewalk.dto.FamilyDataResponse;
import com.example.homewalk.dto.FamilyDto;
import com.example.homewalk.entity.Families;
import com.example.homewalk.service.FamiliesService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/families")
@RequiredArgsConstructor
public class FamiliesController {

    private final FamiliesService familiesService;

    @PostMapping
    public ResponseEntity<Families> createFamilies(@RequestBody Families families, @RequestParam Long userId) {
        families.setCreatorId(userId);  // creatorId 설정
        Families createdFamily = familiesService.createFamilies(families, userId);  // userId를 함께 전달
        return ResponseEntity.ok(createdFamily);
    }

    @GetMapping
    public ResponseEntity<List<FamilyDto>> getAllFamilies(@RequestParam Long userId) {
        List<FamilyDto> families = familiesService.getFamiliesWithJoinStatus(userId);
        return ResponseEntity.ok(families);
    }
    
    // 가족에서 탈퇴하는 엔드포인트
    @DeleteMapping("/leave")
    public ResponseEntity<Void> leaveFamily(@RequestParam Long userId, @RequestParam Long familyId) {
        familiesService.leaveFamily(userId, familyId);
        return ResponseEntity.noContent().build();
    }
    
    // 가족 정보와 구성원 정보를 가져오는 엔드포인트
    @GetMapping("/{userId}/data")
    public ResponseEntity<FamilyDataResponse> getFamilyData(@PathVariable Long userId) {
        FamilyDataResponse familyData = familiesService.getFamilyData(userId);
        return ResponseEntity.ok(familyData);
    }
    
}
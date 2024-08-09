package com.example.homewalk.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.homewalk.dto.FamilyJoinRequestDto;
import com.example.homewalk.entity.FamilyJoinRequest;
import com.example.homewalk.service.JoinRequestService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/join-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JoinRequestsController {

    private final JoinRequestService joinRequestService;

    @PostMapping
    public ResponseEntity<FamilyJoinRequest> requestToJoinFamily(@RequestBody FamilyJoinRequest joinRequest) {
        FamilyJoinRequest createdRequest = joinRequestService.saveJoinRequest(joinRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
    }
    
    @DeleteMapping
    public ResponseEntity<Void> cancelJoinRequest(@RequestParam Long userId, @RequestParam Long familyId) {
        joinRequestService.deleteJoinRequest(userId, familyId);
        return ResponseEntity.noContent().build();
    }

    // 사용자가 만든 가족에 대한 가입 신청 정보 가져오기
    @GetMapping("/creator")
    public ResponseEntity<List<FamilyJoinRequestDto>> getJoinRequestsForCreator(@RequestParam Long creatorId) {
        List<FamilyJoinRequestDto> joinRequests = joinRequestService.getJoinRequestsForCreator(creatorId);
        return ResponseEntity.ok(joinRequests);
    }
    
    // 가입 신청 승인 API 추가
    @PostMapping("/approve")
    public ResponseEntity<String> approveJoinRequest(@RequestParam Long requestId, @RequestParam Long familyId, @RequestParam Long userId) {
        try {
            joinRequestService.approveJoinRequest(requestId, familyId, userId);
            return ResponseEntity.ok("Join request approved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to approve join request: " + e.getMessage());
        }
    }
}

package com.example.homewalk.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<FamilyJoinRequest>> getJoinRequestsForCreator(@RequestParam Long creatorId) {
        List<FamilyJoinRequest> joinRequests = joinRequestService.getJoinRequestsForCreator(creatorId);
        return ResponseEntity.ok(joinRequests);
    }
}

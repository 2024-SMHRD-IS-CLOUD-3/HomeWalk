package com.example.homewalk.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.homewalk.entity.FamilyJoinRequest;
import com.example.homewalk.service.JoinRequestService;

import lombok.RequiredArgsConstructor;

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
}

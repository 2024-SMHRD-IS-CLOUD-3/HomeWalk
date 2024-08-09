package com.example.homewalk.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;
import com.example.homewalk.entity.FamilyJoinRequest;
import com.example.homewalk.repository.FamilyJoinRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JoinRequestService {

    private final FamilyJoinRequestRepository joinRequestRepository;

    public FamilyJoinRequest saveJoinRequest(FamilyJoinRequest joinRequest) {
        joinRequest.setRequestDate(LocalDate.now());
        joinRequest.setApproved(false); // 기본값은 승인되지 않음
        return joinRequestRepository.save(joinRequest);
    }
}

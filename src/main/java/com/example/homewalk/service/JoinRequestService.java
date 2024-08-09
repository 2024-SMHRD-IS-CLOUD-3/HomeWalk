package com.example.homewalk.service;

import java.time.LocalDate;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;
import com.example.homewalk.entity.FamilyJoinRequest;
import com.example.homewalk.repository.FamilyJoinRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional // 클래스 레벨에서 트랜잭션 적용
public class JoinRequestService {

    private final FamilyJoinRequestRepository joinRequestRepository;

    public FamilyJoinRequest saveJoinRequest(FamilyJoinRequest joinRequest) {
        joinRequest.setRequestDate(LocalDate.now());
        joinRequest.setApproved(false); // 기본값은 승인되지 않음
        return joinRequestRepository.save(joinRequest);
    }
    
    public void deleteJoinRequest(Long userId, Long familyId) {
        joinRequestRepository.deleteByUserIdAndFamilyId(userId, familyId);
    }
}

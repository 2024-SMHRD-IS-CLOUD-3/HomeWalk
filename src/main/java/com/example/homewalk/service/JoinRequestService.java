package com.example.homewalk.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;
import com.example.homewalk.dto.FamilyJoinRequestDto;
import com.example.homewalk.entity.FamilyJoinRequest;
import com.example.homewalk.entity.FamilyMembers;
import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.FamilyJoinRequestRepository;
import com.example.homewalk.repository.FamilyMembersRepository;
import com.example.homewalk.repository.FamiliesRepository;
import com.example.homewalk.repository.UsersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional // 클래스 레벨에서 트랜잭션 적용
public class JoinRequestService {

    private final FamilyJoinRequestRepository joinRequestRepository;
    private final FamiliesRepository familiesRepository;
    private final FamilyMembersRepository familyMembersRepository;
    private final UsersRepository usersRepository;

    public FamilyJoinRequest saveJoinRequest(FamilyJoinRequest joinRequest) {
        joinRequest.setRequestDate(LocalDate.now());
        joinRequest.setApproved(false); // 기본값은 승인되지 않음
        return joinRequestRepository.save(joinRequest);
    }
    
    public void deleteJoinRequest(Long userId, Long familyId) {
        joinRequestRepository.deleteByUserIdAndFamilyId(userId, familyId);
    }

    // 특정 사용자가 만든 가족에 대한 가입 신청 정보 가져오기
    public List<FamilyJoinRequestDto> getJoinRequestsForCreator(Long creatorId) {
        // 사용자가 만든 모든 가족 ID를 가져옵니다.
        List<Long> familyIds = familiesRepository.findByCreatorId(creatorId)
            .stream()
            .map(family -> family.getFamilyId())
            .collect(Collectors.toList());

        // 해당 가족 ID들에 대한 모든 가입 신청 목록을 가져옵니다.
        return joinRequestRepository.findByFamilyIdIn(familyIds)
            .stream()
            .map(request -> {
                Users user = usersRepository.findById(request.getUserId())
                    .orElseThrow(() -> new IllegalStateException("User not found with id " + request.getUserId()));
                return new FamilyJoinRequestDto(
                    request.getRequestId(),
                    request.getUserId(),
                    user.getUsername(),
                    request.getFamilyId(),
                    request.getRequestDate(),
                    request.isApproved()
                );
            })
            .collect(Collectors.toList());
    }
    
    public void approveJoinRequest(Long requestId, Long familyId, Long userId) {
        // 1. FamilyJoinRequest 엔티티 가져오기
        FamilyJoinRequest joinRequest = joinRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Join request not found"));

        // 2. 승인 처리
        joinRequest.setApproved(true);
        joinRequest.setApprovalDate(LocalDate.now());
        joinRequestRepository.save(joinRequest);

        // 3. FamilyMembers 엔티티에 추가
        FamilyMembers familyMember = new FamilyMembers();
        familyMember.setFamilyId(familyId);
        familyMember.setUserId(userId);
        familyMember.setJoinDate(LocalDate.now());
        familyMember.setApproved(true);
        familyMembersRepository.save(familyMember);
    }
}

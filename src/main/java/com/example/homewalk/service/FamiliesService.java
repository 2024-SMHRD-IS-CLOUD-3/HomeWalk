package com.example.homewalk.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.example.homewalk.dto.FamilyDataResponse;
import com.example.homewalk.dto.FamilyDto;
import com.example.homewalk.entity.Families;
import com.example.homewalk.entity.FamilyMembers;
import com.example.homewalk.entity.Users;
import com.example.homewalk.entity.FamilyJoinRequest;
import com.example.homewalk.repository.FamiliesRepository;
import com.example.homewalk.repository.FamilyJoinRequestRepository;
import com.example.homewalk.repository.FamilyMembersRepository;
import com.example.homewalk.repository.UsersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FamiliesService {

    private final FamiliesRepository familiesRepository;
    private final FamilyMembersRepository familyMembersRepository;
    private final UsersService usersService;
    private final FamilyJoinRequestRepository joinRequestRepository;
    private final UsersRepository usersRepository;

    public Families createFamilies(Families families, Long userId) {
        // Check if the user already has a family
        if (!familiesRepository.findByCreatorId(userId).isEmpty()) {
            throw new RuntimeException("User already has a family.");
        }
        
        Families savedFamily = familiesRepository.save(families);

        FamilyMembers familyMember = new FamilyMembers();
        familyMember.setFamilyId(savedFamily.getFamilyId());
        familyMember.setUserId(userId);
        familyMember.setJoinDate(LocalDate.now());
        familyMember.setApproved(true);

        familyMembersRepository.save(familyMember);

        return savedFamily;
    }

    public List<FamilyDto> getFamiliesWithJoinStatus(Long userId) {
        List<Families> families = familiesRepository.findAll();
        return families.stream().map(family -> {
            FamilyDto dto = new FamilyDto(family);
            Users creator = usersService.getUserById(family.getCreatorId());
            dto.setCreatorName(creator.getUsername());
            dto.setCreatorId(family.getCreatorId());

            // 해당 사용자의 가족 가입 상태를 확인
            Optional<FamilyJoinRequest> joinRequestOpt = joinRequestRepository.findByUserIdAndFamilyId(userId, family.getFamilyId());
            if (joinRequestOpt.isPresent()) {
                FamilyJoinRequest joinRequest = joinRequestOpt.get();
                dto.setJoinRequested(true);
                dto.setIsMember(joinRequest.isApproved());
            } else {
                dto.setJoinRequested(false);
                dto.setIsMember(false);
            }

            // 가족 구성원 목록 설정, 만든이 제외
            List<String> members = familyMembersRepository.findByFamilyId(family.getFamilyId())
                .stream()
                .map(member -> usersService.getUserById(member.getUserId()).getUsername())
                .filter(username -> !username.equals(creator.getUsername())) // 만든이를 제외
                .collect(Collectors.toList());

            dto.setMembers(members);

            return dto;
        }).collect(Collectors.toList());
    }


    @Transactional
    public void leaveFamily(Long userId, Long familyId) {
        // FamilyMembers 테이블에서 해당 사용자를 제거
        familyMembersRepository.deleteByUserIdAndFamilyId(userId, familyId);

        // FamilyJoinRequests 테이블에서 해당 사용자의 가입 요청 제거
        joinRequestRepository.deleteByUserIdAndFamilyId(userId, familyId);
    }

    public FamilyDataResponse getFamilyData(Long userId) {
        // 가족 정보 가져오기
        Optional<Families> familyOpt = familiesRepository.findByCreatorId(userId).stream().findFirst();
        
        if (!familyOpt.isPresent()) {
            // 가족 정보가 없는 경우 빈 FamilyDataResponse 반환
            return new FamilyDataResponse(); // 또는 null을 반환할 수도 있음
        }

        Families family = familyOpt.get();

        // 가족 구성원 정보 가져오기
        List<FamilyMembers> familyMembers = familyMembersRepository.findByFamilyId(family.getFamilyId());

        // 구성원들의 세부 정보 목록 생성
        List<Map<String, Object>> memberDetails = familyMembers.stream()
            .map(member -> {
                Users user = usersRepository.findById(member.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
                Map<String, Object> details = new HashMap<>();
                details.put("username", user.getUsername());
                details.put("email", user.getEmail());
                details.put("avatarCustomization", user.getAvatarCustomization());
                details.put("joinDate", member.getJoinDate());
                return details;
            })
            .collect(Collectors.toList());

        // 가족 정보와 구성원 정보로 DTO 생성
        FamilyDataResponse familyData = new FamilyDataResponse();
        familyData.setFamilyId(family.getFamilyId());
        familyData.setFamilyName(family.getFamilyName());
        familyData.setCreatedDate(family.getCreatedDate());
        familyData.setCreatorName(usersRepository.findById(family.getCreatorId())
            .orElseThrow(() -> new RuntimeException("Creator not found")).getUsername());
        familyData.setMemberDetails(memberDetails);

        return familyData;
    }


}

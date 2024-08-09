package com.example.homewalk.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.example.homewalk.dto.FamilyDto;
import com.example.homewalk.entity.Families;
import com.example.homewalk.entity.FamilyMembers;
import com.example.homewalk.entity.Users;
import com.example.homewalk.entity.FamilyJoinRequest;
import com.example.homewalk.repository.FamiliesRepository;
import com.example.homewalk.repository.FamilyJoinRequestRepository;
import com.example.homewalk.repository.FamilyMembersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FamiliesService {

    private final FamiliesRepository familiesRepository;
    private final FamilyMembersRepository familyMembersRepository;
    private final UsersService usersService;
    private final FamilyJoinRequestRepository joinRequestRepository;

    public Families createFamilies(Families families, Long userId) {
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
            Optional<FamilyJoinRequest> joinRequest = joinRequestRepository.findByUserIdAndFamilyId(userId, family.getFamilyId());

            if (joinRequest.isPresent()) {
                dto.setJoinRequested(true);
                dto.setIsMember(joinRequest.get().isApproved());
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

            dto.setMembers(members); // dto에 설정

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
}

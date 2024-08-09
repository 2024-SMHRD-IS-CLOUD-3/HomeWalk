package com.example.homewalk.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
            Optional<FamilyJoinRequest> joinRequest = joinRequestRepository.findByUserIdAndFamilyId(userId, family.getFamilyId());
            dto.setJoinRequested(joinRequest.isPresent());
            return dto;
        }).collect(Collectors.toList());
    }
}

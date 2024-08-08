package com.example.homewalk.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.homewalk.entity.Families;
import com.example.homewalk.entity.FamilyMembers;
import com.example.homewalk.repository.FamiliesRepository;
import com.example.homewalk.repository.FamilyMembersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FamiliesService {

    private final FamiliesRepository familiesRepository;
    private final FamilyMembersRepository familyMembersRepository;

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

    public List<Families> getAllFamilies() {
        return familiesRepository.findAll();
    }
}

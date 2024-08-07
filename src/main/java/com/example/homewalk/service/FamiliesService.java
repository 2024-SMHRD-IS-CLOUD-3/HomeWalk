package com.example.homewalk.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.homewalk.entity.Families;
import com.example.homewalk.repository.FamiliesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FamiliesService {

    private final FamiliesRepository familiesRepository;

    public Families createFamilies(Families families) {
        return familiesRepository.save(families);
    }
    
    public List<Families> getAllFamilies() {
        return familiesRepository.findAll();
    }
}
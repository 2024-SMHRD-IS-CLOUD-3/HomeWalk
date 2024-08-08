package com.example.homewalk.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.homewalk.entity.Families;
import com.example.homewalk.service.FamiliesService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/families")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FamiliesController {

    private final FamiliesService familiesService;

    @PostMapping
    public ResponseEntity<Families> createFamilies(@RequestBody Families families, @RequestParam Long userId) {
        Families createdFamily = familiesService.createFamilies(families, userId);
        return ResponseEntity.ok(createdFamily);
    }

    @GetMapping
    public ResponseEntity<List<Families>> getAllFamilies() {
        List<Families> families = familiesService.getAllFamilies();
        return ResponseEntity.ok(families);
    }
}

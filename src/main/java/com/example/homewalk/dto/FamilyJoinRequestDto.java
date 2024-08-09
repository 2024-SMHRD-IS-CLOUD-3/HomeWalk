package com.example.homewalk.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FamilyJoinRequestDto {
    private Long requestId;
    private Long userId;
    private String username;
    private Long familyId;
    private LocalDate requestDate;
    private boolean approved;
}

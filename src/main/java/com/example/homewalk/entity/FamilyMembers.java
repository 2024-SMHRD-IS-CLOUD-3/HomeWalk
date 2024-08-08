package com.example.homewalk.entity;

import java.time.LocalDate;
import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "family_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMembers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long familyMemberId;

    private Long familyId;
    private Long userId;
    private LocalDate joinDate;
    private Boolean approved;
}

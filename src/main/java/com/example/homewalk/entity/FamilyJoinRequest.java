package com.example.homewalk.entity;

import javax.persistence.*;
import java.time.LocalDate;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "family_join_requests")
@Data
@NoArgsConstructor
public class FamilyJoinRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @Column(nullable = false)
    private Long familyId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDate requestDate;

    @Column(nullable = false)
    private Boolean approved;

    private LocalDate approvalDate;
}

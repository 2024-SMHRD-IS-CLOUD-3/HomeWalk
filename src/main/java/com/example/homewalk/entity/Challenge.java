package com.example.homewalk.entity;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "challenges")
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long challengeId;

    @Column(name = "challenge_type", nullable = false)
    private String challengeType;

    @Column(name = "goal_value")
    private Integer goalValue;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "reward")
    private String reward;

    @Column(name = "created_by", nullable = false)
    private String createdBy;
    
    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL)
    @JsonManagedReference  // 부모 관계에 해당하는 곳에 이 어노테이션을 사용합니다.
    private List<ChallengeParticipant> participants;

}

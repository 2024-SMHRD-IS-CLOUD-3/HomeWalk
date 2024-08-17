package com.example.homewalk.entity;

import javax.persistence.*;

import lombok.Data;

@Entity
@Data
@Table(name = "challenge_participants")
public class ChallengeParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long challengeParticipantId;

    @ManyToOne
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "progress", nullable = false)
    private Integer progress;

    @Column(name = "achieved", nullable = false)
    private Boolean achieved;

}

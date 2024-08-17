package com.example.homewalk.entity;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Data;

@Entity
@Data
@Table(name = "challenge_participants")
public class ChallengeParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long challengeParticipantId;

    @ManyToOne
    @JsonBackReference  // 자식 관계에 해당하는 곳에 이 어노테이션을 사용합니다.
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "progress", nullable = false)
    private Integer progress;

    @Column(name = "achieved", nullable = false)
    private Boolean achieved;
    
    // Achieved에 대한 getter 추가
    public boolean isAchieved() {
        return achieved;
    }

}

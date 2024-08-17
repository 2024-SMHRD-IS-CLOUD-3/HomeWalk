package com.example.homewalk.repository;

import com.example.homewalk.entity.Challenge;
import com.example.homewalk.entity.ChallengeParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeParticipantsRepository extends JpaRepository<ChallengeParticipant, Long> {

    // 특정 사용자가 참여하고 있는 모든 챌린지를 가져옵니다.
    List<ChallengeParticipant> findByUserId(Long userId);

    // 특정 챌린지에 특정 사용자가 참여하고 있는지 확인합니다.
    ChallengeParticipant findByChallengeAndUserId(Challenge challenge, Long userId);
}

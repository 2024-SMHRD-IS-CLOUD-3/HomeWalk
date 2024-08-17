package com.example.homewalk.repository;

import com.example.homewalk.entity.ChallengeParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChallengeParticipantsRepository extends JpaRepository<ChallengeParticipant, Long> {
}

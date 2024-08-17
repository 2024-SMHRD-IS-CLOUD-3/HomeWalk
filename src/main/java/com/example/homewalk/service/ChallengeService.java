package com.example.homewalk.service;

import com.example.homewalk.entity.Challenge;
import com.example.homewalk.entity.ChallengeParticipant;
import com.example.homewalk.repository.ChallengeParticipantsRepository;
import com.example.homewalk.repository.ChallengeRepository;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChallengeService {

	@Autowired
	private ChallengeRepository challengeRepository;

	@Autowired
	private ChallengeParticipantsRepository participantsRepository;

	public List<Challenge> getAllChallenges() {
		return challengeRepository.findAll();
	}

	// 사용자가 참여 중인 챌린지 가져오기
	public List<Challenge> getCurrentChallenges(Long userId) {
        List<ChallengeParticipant> participantEntries = participantsRepository.findByUserId(userId);
        return participantEntries.stream()
                                 .filter(participant -> !participant.isAchieved()) // achieved가 false인 챌린지만 필터링
                                 .map(ChallengeParticipant::getChallenge)
                                 .collect(Collectors.toList());
    }

	// 사용자가 만들지 않은 다른 사람들이 만든 챌린지 가져오기
	public List<Challenge> getAvailableChallenges(Long userId) {
		List<Challenge> allChallenges = challengeRepository.findAll();
		return allChallenges.stream().filter(challenge -> !challenge.getCreatedBy().equals(userId))
				.filter(challenge -> participantsRepository.findByChallengeAndUserId(challenge, userId) == null)
				.collect(Collectors.toList());
	}
	
	// 완료된 챌린지 가져오기
    public List<Challenge> getCompletedChallenges(Long userId) {
        List<ChallengeParticipant> participantEntries = participantsRepository.findByUserIdAndAchievedTrue(userId);
        return participantEntries.stream()
                                 .map(ChallengeParticipant::getChallenge)
                                 .collect(Collectors.toList());
    }

	@Transactional
	public Challenge createChallengeWithParticipant(Challenge challenge) {
		// 챌린지 저장
		Challenge savedChallenge = challengeRepository.save(challenge);

		// 챌린지를 만든 사용자를 자동으로 참여자로 추가
		ChallengeParticipant participant = new ChallengeParticipant();
		participant.setChallenge(savedChallenge);
		participant.setUserId(challenge.getCreatedUserId()); // createdBy 필드를 사용하여 참여자로 추가
		participant.setProgress(0); // 초기 진행 상황 설정
		participant.setAchieved(false); // 초기 목표 달성 여부 설정

		participantsRepository.save(participant);

		return savedChallenge;
	}

	// 새로운 참여자 추가 기능 구현
	@Transactional
	public ChallengeParticipant addParticipantToChallenge(Long challengeId, Long userId) {
		Challenge challenge = challengeRepository.findById(challengeId)
				.orElseThrow(() -> new IllegalArgumentException("Invalid challenge Id:" + challengeId));

		ChallengeParticipant participant = new ChallengeParticipant();
		participant.setChallenge(challenge);
		participant.setUserId(userId);
		participant.setProgress(0); // 초기 진행 상황 설정
		participant.setAchieved(false); // 초기 목표 달성 여부 설정

		return participantsRepository.save(participant);
	}

	// 챌린지에서 사용자 제거 기능 구현
	@Transactional
	public void leaveChallenge(Long challengeId, Long userId) {
		Challenge challenge = challengeRepository.findById(challengeId)
				.orElseThrow(() -> new IllegalArgumentException("Invalid challenge Id:" + challengeId));

		ChallengeParticipant participant = participantsRepository.findByChallengeAndUserId(challenge, userId);
		if (participant != null) {
			participantsRepository.delete(participant);
		} else {
			throw new IllegalArgumentException("Participant not found for the given challenge and user");
		}
	}
	
	@Transactional
    public void updateChallengeAchievement(Long challengeId, Long userId, boolean achieved) {
        Challenge challenge = challengeRepository.findById(challengeId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid challenge Id:" + challengeId));

        ChallengeParticipant participant = participantsRepository.findByChallengeAndUserId(challenge, userId);
        if (participant != null) {
            participant.setAchieved(achieved);
            participantsRepository.save(participant);
        } else {
            throw new IllegalArgumentException("Participant not found for the given challenge and user");
        }
    }
	
	@Transactional
    public void deleteChallenge(Long challengeId) {
        // 먼저 관련된 참가자 정보 삭제
        participantsRepository.deleteByChallenge_ChallengeId(challengeId);
        
        // 그 다음 챌린지 삭제
        challengeRepository.deleteById(challengeId);
    }

}

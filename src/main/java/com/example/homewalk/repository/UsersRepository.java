package com.example.homewalk.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.homewalk.entity.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Users findByUsernameAndPassword(String username, String password);
    Users findByUsername(String username);
    Users findByUserId(Long userId);
	Optional<Users> findByEmail(String email);
	
	// 카카오 ID로 사용자 조회
    Optional<Users> findByKakaoId(String kakaoId);
}

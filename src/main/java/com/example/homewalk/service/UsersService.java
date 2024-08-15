package com.example.homewalk.service;

import com.example.homewalk.entity.DeactivationReason;
import com.example.homewalk.entity.PasswordResetToken;
import com.example.homewalk.entity.UserDeactivation;
import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.DeactivationReasonRepository;
import com.example.homewalk.repository.PasswordResetTokenRepository;
import com.example.homewalk.repository.UserDeactivationRepository;
import com.example.homewalk.repository.UsersRepository;
import com.example.homewalk.util.JwtUtil; // JWT 유틸리티 클래스
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import java.io.IOException;
import java.io.InputStream;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private JwtUtil jwtUtil; // JWT 유틸리티 클래스 주입
    
    @Autowired
    private PasswordResetTokenRepository tokenRepository; // 비밀번호 재설정 토큰 레포지토리 주입
    
    @Autowired
    private DeactivationReasonRepository deactivationReasonRepository;
    
    @Autowired
    private UserDeactivationRepository userDeactivationRepository;
    
    public Users findById(Long userId) {
        return usersRepository.findByUserId(userId);
    }

    public Users registerUser(Users users) {
        if (usersRepository.existsByUsername(users.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (usersRepository.existsByEmail(users.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        return usersRepository.save(users);
    }

    public Users authenticateUser(String username, String password) {
        Users user = usersRepository.findByUsernameAndPassword(username, password);
        if (user != null && user.getIsActive()) {
            return user;
        }
        return null;
    }

    public boolean existsByUsername(String username) {
        return usersRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return usersRepository.existsByEmail(email);
    }

    public String generateToken(Users user) {
        return jwtUtil.generateToken(user.getUsername());
    }
    
    public Users getUserById(Long userId) {
        return usersRepository.findByUserId(userId);
    }
    
    public Users getUserFromToken(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        return usersRepository.findByUsername(username);
    }
    
    public void updateUser(Users user) {
        // 비밀번호 암호화 등의 작업을 여기에서 수행할 수 있습니다.
        usersRepository.save(user);
    }

    // 이미지 업로드 및 프로필 업데이트 메서드
    public String uploadUserProfileImage(String token, MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            Users user = usersRepository.findByUsername(username);

            if (user == null) {
                throw new RuntimeException("User not found");
            }

            String fileExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
            String uniqueFileName = user.getUserId() + "_" + UUID.randomUUID().toString() + fileExtension;
            Path path = Paths.get("src/assets/profile/" + uniqueFileName);
            Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);

            String filePath = "/assets/profile/" + uniqueFileName;
            user.setAvatarCustomization(filePath);
            usersRepository.save(user);

            return filePath;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    // 사용자 정보를 기반으로 프로필 이미지를 가져오는 메서드
    public String getUserProfileImage(Long userId) {
        Users user = usersRepository.findByUserId(userId);
        if (user != null) {
            return user.getAvatarCustomization(); // 사용자 이미지 경로 반환
        }
        return null; // 사용자 정보가 없을 경우 null 반환
    }
    
    // 비밀번호 재설정 토큰 생성 및 저장 메서드
    @Transactional
    public String createPasswordResetToken(String email) {
        // 이메일로 사용자 찾기
        Optional<Users> userOpt = usersRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            Users user = userOpt.get(); // Users 엔티티를 조회

            // 고유한 토큰 생성
            String token = UUID.randomUUID().toString();

            // 기존 토큰이 있다면 삭제
            tokenRepository.deleteByUser_UserId(user.getUserId());

            // 새로운 토큰 저장
            PasswordResetToken resetToken = new PasswordResetToken(token, user);
            tokenRepository.save(resetToken);

            return token;
        } else {
            throw new RuntimeException("User not found with email: " + email);
        }
    }
    
    // 토큰을 이용하여 사용자 찾기
    public Users getUserByPasswordResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null || resetToken.isExpired()) {
            throw new RuntimeException("Invalid or expired password reset token");
        }

        return resetToken.getUser(); // 토큰으로 연결된 Users 엔티티를 반환
    }

    // 비밀번호 재설정 메서드
    public void resetPassword(String token, String newPassword) {
        Users user = getUserByPasswordResetToken(token); // 토큰을 통해 Users 엔티티를 조회
        user.setPassword(newPassword); // 비밀번호를 새 비밀번호로 설정
        usersRepository.save(user); // 변경된 비밀번호를 저장
    }

    // 만료된 토큰 삭제
    public void deleteExpiredTokens() {
        tokenRepository.deleteAllExpiredTokens(new Date());
    }
    
    public List<DeactivationReason> getDeactivationReasons() {
        return deactivationReasonRepository.findAll();
    }
    
    public void deactivateUser(Users user, Long reasonId, String comments) {
        // 1. User의 isActive 필드를 false로 설정
        user.setIsActive(false);
        usersRepository.save(user);

        // 2. 탈퇴 정보를 UserDeactivation 테이블에 저장
        UserDeactivation deactivation = new UserDeactivation();
        deactivation.setUser(user);
        deactivation.setDeactivationDate(LocalDateTime.now());
        deactivation.setReason(deactivationReasonRepository.findById(reasonId).orElse(null));
        deactivation.setAdditionalComments(comments);
        userDeactivationRepository.save(deactivation);
    }
}

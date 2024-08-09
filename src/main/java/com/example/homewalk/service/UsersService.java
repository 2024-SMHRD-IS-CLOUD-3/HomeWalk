package com.example.homewalk.service;

import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.UsersRepository;
import com.example.homewalk.util.JwtUtil; // JWT 유틸리티 클래스
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.io.IOException;
import java.io.InputStream;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private JwtUtil jwtUtil; // JWT 유틸리티 클래스 주입
    
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
}

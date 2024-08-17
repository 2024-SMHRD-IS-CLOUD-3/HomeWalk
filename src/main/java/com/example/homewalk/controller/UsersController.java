package com.example.homewalk.controller;

import com.example.homewalk.dto.DeactivateRequest;
import com.example.homewalk.dto.DeactivationStatisticsDto;
import com.example.homewalk.entity.Users;
import com.example.homewalk.service.UsersService;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Users users) {
        try {
            Users registeredUser = usersService.registerUser(users);
            return ResponseEntity.ok(registeredUser.getUserId()); // userId 반환
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody Users users) {
        Users authenticatedUser = usersService.authenticateUser(users.getUsername(), users.getPassword());
        
        if (authenticatedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        if (!authenticatedUser.getIsActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User is inactive");
        }

        String token = usersService.generateToken(authenticatedUser); // 토큰 생성 메소드 호출

        // AuthResponse 객체 생성 및 반환
        AuthResponse authResponse = new AuthResponse(
            authenticatedUser.getUserId(),
            token,
            authenticatedUser.getUsername(),
            authenticatedUser.getEmail(),
            authenticatedUser.getAvatarCustomization(),
            authenticatedUser.getDailyStepGoal(),
            authenticatedUser.getWeeklyStepGoal(),
            authenticatedUser.getMonthlyStepGoal(),
            authenticatedUser.getIsActive()
        );

        return ResponseEntity.ok(authResponse); // AuthResponse 객체 반환
    }



    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
        boolean exists = usersService.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = usersService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/user")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            Users user = usersService.getUserFromToken(token);
            // 사용자의 username, email, password를 포함한 객체 반환
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/user")
    public ResponseEntity<?> updateUserProfile(@RequestHeader("Authorization") String token, @RequestBody Users updatedUser) {
        try {
            Users user = usersService.getUserFromToken(token);
            user.setUsername(updatedUser.getUsername());
            user.setPassword(updatedUser.getPassword());
            user.setEmail(updatedUser.getEmail());
            
            // 경로가 존재하는 경우 업데이트
            if (updatedUser.getAvatarCustomization() != null) {
                user.setAvatarCustomization(updatedUser.getAvatarCustomization());
            }

            usersService.updateUser(user); // 사용자 업데이트
            return ResponseEntity.ok("User profile updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload-avatar")
    public ResponseEntity<String> uploadAvatar(@RequestHeader("Authorization") String token, @RequestParam("file") MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            if (fileName != null) {
                fileName = fileName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_"); // 안전한 파일명으로 변환
            }

            Path directoryPath = Paths.get("src/main/resources/static/assets/profile/");
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath); // 디렉토리 생성
            }

            Path path = directoryPath.resolve(fileName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // 저장된 파일 경로 반환
            String filePath = "/assets/profile/" + fileName;

            // 사용자 정보를 업데이트
            Users user = usersService.getUserFromToken(token);
            user.setAvatarCustomization(filePath);
            usersService.updateUser(user); // 사용자 업데이트

            return ResponseEntity.ok(filePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }
    
    @GetMapping("/deactivation-reasons")
    public ResponseEntity<?> getDeactivationReasons() {
        try {
            return ResponseEntity.ok(usersService.getDeactivationReasons());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch deactivation reasons: " + e.getMessage());
        }
    }

    @PostMapping("/deactivate-user")
    public ResponseEntity<String> deactivateUser(
            @RequestHeader("Authorization") String token,
            @RequestBody DeactivateRequest deactivateRequest) {
        try {
            Users user = usersService.getUserFromToken(token);
            System.out.println("reasonId : " + deactivateRequest.getReasonId());
            usersService.deactivateUser(user, deactivateRequest.getReasonId(), deactivateRequest.getComments()); // 사용자 탈퇴 처리
            return ResponseEntity.ok("User deactivated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to deactivate user: " + e.getMessage());
        }
    }
    
    @GetMapping("/deactivation-stats")
    public ResponseEntity<List<DeactivationStatisticsDto>> getDeactivationStatistics() {
        List<DeactivationStatisticsDto> stats = usersService.getDeactivationStatistics();
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/upload-kakao-avatar")
    public ResponseEntity<String> uploadKakaoAvatar(@RequestHeader("Authorization") String token, @RequestParam("imageUrl") String imageUrl) {
        try {
            // 사용자 정보를 가져와서 프로필 이미지를 업데이트
            Users user = usersService.getUserFromToken(token);

            // 받은 imageUrl 그대로 DB에 저장
            user.setAvatarCustomization(imageUrl);
            usersService.updateUser(user); // 사용자 업데이트

            return ResponseEntity.ok("Profile image URL updated successfully: " + imageUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile image: " + e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> usersList = usersService.getAllUsers();
        return ResponseEntity.ok(usersList);
    }
}

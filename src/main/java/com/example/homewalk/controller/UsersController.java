package com.example.homewalk.controller;

import com.example.homewalk.entity.Users;
import com.example.homewalk.service.UsersService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
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
        if (authenticatedUser != null) {
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
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
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


}

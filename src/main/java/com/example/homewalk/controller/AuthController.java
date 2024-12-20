package com.example.homewalk.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.homewalk.entity.Users;
import com.example.homewalk.service.EmailService;
import com.example.homewalk.service.UsersService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsersService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // 사용자 확인
        if (!userService.existsByEmail(email)) {
            // HashMap을 사용하여 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "User with this email does not exist.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // 비밀번호 재설정 토큰 생성 및 저장
            String token = userService.createPasswordResetToken(email);

            // 비밀번호 재설정 링크 생성
            String resetLink = "http://192.168.219.55:3005/resetpasswordpage?token=" + token;
            
            System.out.println("resetLink : " + resetLink);

            // 이메일 전송
            emailService.sendResetPasswordEmail(email, resetLink);

            // HashMap을 사용하여 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password reset link has been sent to your email.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // HashMap을 사용하여 오류 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send password reset email.");
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @PostMapping("/reset-password/confirm")
    public ResponseEntity<?> confirmResetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        // 토큰 검증 및 사용자 조회
        Users user = userService.getUserByPasswordResetToken(token);
        if (user == null) {
            // HashMap을 사용하여 오류 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid or expired token.");
            return ResponseEntity.badRequest().body(response);
        }

        // 비밀번호 업데이트
        user.setPassword(newPassword); // 필요 시 비밀번호 암호화 추가
        userService.updateUser(user); // 사용자 정보 업데이트

        // HashMap을 사용하여 성공 응답 생성
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Password has been reset successfully.");
        return ResponseEntity.ok(response);
    }

}

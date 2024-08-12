package com.example.homewalk.controller;

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
        	return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User with this email does not exist."));
        }

        try {
        	// 비밀번호 재설정 토큰 생성 및 저장
            String token = userService.createPasswordResetToken(email);

            // 비밀번호 재설정 링크 생성
            String resetLink = "http://localhost:3000/resetpasswordpage?token=" + token;
            
            System.out.println("resetLink : " + resetLink);

            // 이메일 전송
            emailService.sendResetPasswordEmail(email, resetLink);

            return ResponseEntity.ok(Map.of("success", true, "message", "Password reset link has been sent to your email."));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("success", false, "message", "Failed to send password reset email."));
		}
        
        
    }
    
    @PostMapping("/reset-password/confirm")
    public ResponseEntity<?> confirmResetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        // 토큰 검증 및 사용자 조회
        Users user = userService.getUserByPasswordResetToken(token);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid or expired token."));
        }

        // 비밀번호 업데이트
        user.setPassword(newPassword); // 필요 시 비밀번호 암호화 추가
        userService.updateUser(user); // 사용자 정보 업데이트

        return ResponseEntity.ok(Map.of("success", true, "message", "Password has been reset successfully."));
    }
}

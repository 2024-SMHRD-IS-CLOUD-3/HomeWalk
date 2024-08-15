package com.example.homewalk.util;

import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "your_secret_key";

    // 사용자 ID를 기반으로 토큰 생성
    public String generateToken(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))  // userId를 기반으로 토큰 생성
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // 토큰에서 사용자 ID 추출
    public Long extractUserId(String token) {
        return Long.parseLong(extractAllClaims(token).getSubject());
    }

    // 토큰 만료 여부 확인
    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // 토큰 유효성 검사
    public boolean validateToken(String token, Long userId) {
        return (extractUserId(token).equals(userId) && !isTokenExpired(token));
    }

    // 모든 클레임 추출
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }
}

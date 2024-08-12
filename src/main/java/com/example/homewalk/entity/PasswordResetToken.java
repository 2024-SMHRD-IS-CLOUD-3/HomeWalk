package com.example.homewalk.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;

@Data
@Entity
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)  // 'user_id' 컬럼을 명시적으로 참조
    private Users user;

    @Column(nullable = false)
    private Date expiryDate;

    public PasswordResetToken() {
    }

    public PasswordResetToken(String token, Users user) {
        this.token = token;
        this.user = user;
        this.expiryDate = calculateExpiryDate(24 * 60); // 토큰 만료 시간 설정 (예: 24시간)
    }

    private Date calculateExpiryDate(int expiryTimeInMinutes) {
        return new Date(System.currentTimeMillis() + expiryTimeInMinutes * 60 * 1000);
    }

    public boolean isExpired() {
        return new Date().after(this.expiryDate);
    }

}


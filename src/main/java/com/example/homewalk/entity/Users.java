package com.example.homewalk.entity;

import javax.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 50)
    private String password;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(name = "avatar_customization", length = 255)
    private String avatarCustomization;  // URL을 저장하기 위해 VARCHAR(255) 사용

    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer dailyStepGoal = 0;

    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer weeklyStepGoal = 0;

    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer monthlyStepGoal = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;
    
    // 카카오 ID 추가
    @Column(name = "kakao_id", unique = true, length = 50)
    private String kakaoId;

}

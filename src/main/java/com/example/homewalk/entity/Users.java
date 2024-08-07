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

    @Column(columnDefinition = "JSON")
    private String avatarCustomization;

    private Integer dailyStepGoal;

    private Integer weeklyStepGoal;

    private Integer monthlyStepGoal;

    @Column(name = "is_active")
    private Boolean isActive = true;
}

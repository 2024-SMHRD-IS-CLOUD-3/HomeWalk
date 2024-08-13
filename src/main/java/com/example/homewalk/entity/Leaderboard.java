package com.example.homewalk.entity;

import javax.persistence.*;

import lombok.Data;

@Data
@Entity
@Table(name = "leaderboard")
public class Leaderboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leaderboardId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    private int ranking;
    private int totalSteps;

}

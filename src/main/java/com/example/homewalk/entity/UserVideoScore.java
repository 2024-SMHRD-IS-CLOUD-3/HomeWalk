package com.example.homewalk.entity;

import javax.persistence.*;

import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "user_video_scores")
public class UserVideoScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "video_id", nullable = false)
    private String videoId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "score", nullable = false)
    private int score;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

}

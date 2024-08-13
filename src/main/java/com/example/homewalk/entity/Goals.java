package com.example.homewalk.entity;

import javax.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "goals")
public class Goals {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goal_id")
    private Long goalId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "goal_type", nullable = false, length = 50)
    private String goalType;

    @Column(name = "goal_value", nullable = false)
    private Integer goalValue;

    @Column(name = "achieved", nullable = false)
    private Boolean achieved;

    @Column(name = "feedback_message", length = 255)
    private String feedbackMessage;
}

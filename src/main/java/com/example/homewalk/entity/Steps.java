package com.example.homewalk.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "steps")
public class Steps {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "step_id")
    private Long stepId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "steps_count")
    private int stepsCount;

    @Column(name = "hourly_data")
    private String hourlyData; // JSON 데이터를 String으로 저장

    // 필요에 따라 JSON 데이터를 처리하는 메서드를 추가할 수 있습니다.
}

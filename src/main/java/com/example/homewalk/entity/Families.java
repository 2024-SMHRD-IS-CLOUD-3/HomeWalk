package com.example.homewalk.entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "families")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Families {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "family_id")
    private Long familyId;

    @Column(name = "family_name")
    private String familyName;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(nullable = false)
    private Long creatorId; // 추가된 필드
    
    public Families(String familyName) {
        this.familyName = familyName;
    }

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDate.now();
    }
    
    @Transient
    private String creatorName; // 데이터베이스에 저장되지 않는 필드
}

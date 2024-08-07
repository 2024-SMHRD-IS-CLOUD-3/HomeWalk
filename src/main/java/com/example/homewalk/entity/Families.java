package com.example.homewalk.entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

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

    public Families(String familyName) {
        this.familyName = familyName;
        this.createdDate = LocalDate.now();
    }
}
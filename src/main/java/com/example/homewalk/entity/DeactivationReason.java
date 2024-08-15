package com.example.homewalk.entity;

import javax.persistence.*;

import lombok.Data;

@Entity
@Data
@Table(name = "account_deactivation_reasons")
public class DeactivationReason {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reasonId;

    @Column(name = "reason_text", nullable = false)
    private String reasonText;

}

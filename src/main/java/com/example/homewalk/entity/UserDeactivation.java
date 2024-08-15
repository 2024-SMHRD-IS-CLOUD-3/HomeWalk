package com.example.homewalk.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "user_deactivations")
public class UserDeactivation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deactivationId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(name = "deactivation_date", nullable = false)
    private LocalDateTime deactivationDate;

    @ManyToOne
    @JoinColumn(name = "reason_id", nullable = false)
    private DeactivationReason reason;

    @Column(name = "additional_comments")
    private String additionalComments;

}

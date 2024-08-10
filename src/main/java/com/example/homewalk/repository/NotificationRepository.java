package com.example.homewalk.repository;

import com.example.homewalk.entity.Notification;
import com.example.homewalk.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserAndIsReadFalse(Users user);
}

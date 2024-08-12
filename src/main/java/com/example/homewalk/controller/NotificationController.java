package com.example.homewalk.controller;

import com.example.homewalk.dto.NotificationRequest;
import com.example.homewalk.entity.Notification;
import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.UsersRepository;
import com.example.homewalk.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UsersRepository usersRepository;

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody NotificationRequest request) {
        // DTO에서 userId와 message를 추출
        Users user = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(request.getMessage());
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);

        Notification createdNotification = notificationService.createNotification(notification);
        return ResponseEntity.ok(createdNotification);
    }


    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long notificationId) {
        notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok().build();
    }
}

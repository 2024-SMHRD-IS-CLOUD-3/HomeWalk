package com.example.homewalk.service;

import com.example.homewalk.entity.Notification;
import com.example.homewalk.entity.Users;
import com.example.homewalk.repository.NotificationRepository;
import com.example.homewalk.repository.UsersRepository; // UsersRepository 추가
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UsersRepository usersRepository; // UsersRepository 추가

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserAndIsReadFalse(user);
    }

    public void markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true); // 알림을 읽음으로 표시
        notificationRepository.save(notification);
    }
}

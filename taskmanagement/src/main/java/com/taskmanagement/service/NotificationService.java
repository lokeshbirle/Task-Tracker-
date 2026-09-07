package com.taskmanagement.service;

import com.taskmanagement.dto.response.NotificationResponse;
import com.taskmanagement.enums.NotificationType;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.model.Notification;
import com.taskmanagement.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationResponse> getForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedDateDesc(userId)
                .stream().map(NotificationResponse::from).toList();
    }

    public NotificationResponse markRead(String id, String requestingUserId) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));

        if (!n.getUserId().equals(requestingUserId)) {
            throw new ResourceNotFoundException("Notification not found: " + id); // don't leak existence
        }

        n.setRead(true);
        return NotificationResponse.from(notificationRepository.save(n));
    }

    // --- Internal helpers used by TaskService to raise notifications on key events (spec section 11) ---

    public void notify(String userId, NotificationType type, String message, String relatedTaskId) {
        Notification n = Notification.builder()
                .userId(userId)
                .type(type)
                .message(message)
                .relatedTaskId(relatedTaskId)
                .read(false)
                .build();
        notificationRepository.save(n);
    }
}

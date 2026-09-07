package com.taskmanagement.dto.response;

import com.taskmanagement.enums.NotificationType;
import com.taskmanagement.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private String id;
    private NotificationType type;
    private String message;
    private String relatedTaskId;
    private boolean read;
    private Instant createdDate;

    public static NotificationResponse from(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .message(n.getMessage())
                .relatedTaskId(n.getRelatedTaskId())
                .read(n.isRead())
                .createdDate(n.getCreatedDate())
                .build();
    }
}

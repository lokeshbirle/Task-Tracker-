package com.taskmanagement.controller;

import com.taskmanagement.dto.response.NotificationResponse;
import com.taskmanagement.security.CurrentUserUtil;
import com.taskmanagement.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications() {
        return ResponseEntity.ok(notificationService.getForUser(CurrentUserUtil.userId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markRead(@PathVariable String id) {
        return ResponseEntity.ok(notificationService.markRead(id, CurrentUserUtil.userId()));
    }
}

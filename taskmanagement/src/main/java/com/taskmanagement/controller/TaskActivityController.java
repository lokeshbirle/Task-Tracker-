package com.taskmanagement.controller;

import com.taskmanagement.dto.response.ActivityResponse;
import com.taskmanagement.security.CurrentUserUtil;
import com.taskmanagement.service.TaskActivityService;
import com.taskmanagement.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/activity")
@RequiredArgsConstructor
public class TaskActivityController {

    private final TaskActivityService taskActivityService;
    private final TaskService taskService; // used purely to enforce view access before exposing history

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getActivity(@PathVariable String taskId) {
        // Reuses the same access rule as viewing the task itself.
        taskService.getTaskById(taskId, CurrentUserUtil.userId(), CurrentUserUtil.isAdmin());
        return ResponseEntity.ok(taskActivityService.getForTask(taskId));
    }
}

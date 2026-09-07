package com.taskmanagement.controller;

import com.taskmanagement.dto.request.AssignTaskRequest;
import com.taskmanagement.dto.request.CreateTaskRequest;
import com.taskmanagement.dto.request.UpdateTaskRequest;
import com.taskmanagement.dto.request.UpdateTaskStatusRequest;
import com.taskmanagement.dto.response.TaskResponse;
import com.taskmanagement.security.CurrentUserUtil;
import com.taskmanagement.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /**
     * Admins get every task; Employees get only their own (spec section 15:
     * "Employees should only see their authorized tasks").
     */
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks() {
        if (CurrentUserUtil.isAdmin()) {
            return ResponseEntity.ok(taskService.getAllTasks());
        }
        return ResponseEntity.ok(taskService.getTasksForUser(CurrentUserUtil.userId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getTaskById(id, CurrentUserUtil.userId(), CurrentUserUtil.isAdmin()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(request, CurrentUserUtil.userId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable String id, @RequestBody UpdateTaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request, CurrentUserUtil.userId()));
    }

    /** Admin OR the assigned employee — enforced inside the service (rule #4). */
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable String id, @Valid @RequestBody UpdateTaskStatusRequest request) {
        return ResponseEntity.ok(taskService.updateStatus(
                id, request, CurrentUserUtil.userId(), CurrentUserUtil.isAdmin()));
    }

    /** rule #5: only Admins may change task assignment. */
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskResponse> reassignTask(@PathVariable String id, @Valid @RequestBody AssignTaskRequest request) {
        return ResponseEntity.ok(taskService.reassignTask(id, request, CurrentUserUtil.userId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id, CurrentUserUtil.userId());
        return ResponseEntity.noContent().build();
    }
}

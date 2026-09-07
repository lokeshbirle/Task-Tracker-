package com.taskmanagement.controller;

import com.taskmanagement.dto.response.DashboardStatsResponse;
import com.taskmanagement.repository.TeamRepository;
import com.taskmanagement.repository.UserRepository;
import com.taskmanagement.security.CurrentUserUtil;
import com.taskmanagement.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Backs spec sections 13 (Admin Dashboard) and 14 (Employee Dashboard). */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TaskService taskService;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        if (CurrentUserUtil.isAdmin()) {
            long totalUsers = userRepository.count();
            long totalTeams = teamRepository.count();
            return ResponseEntity.ok(taskService.getAdminStats(totalUsers, totalTeams));
        }
        return ResponseEntity.ok(taskService.getEmployeeStats(CurrentUserUtil.userId()));
    }
}

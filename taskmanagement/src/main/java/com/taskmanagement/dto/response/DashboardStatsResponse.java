package com.taskmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Shared shape for both Admin (org-wide) and Employee (personal) dashboard stats. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalUsers;      // 0 for employee dashboard
    private long totalTeams;      // 0 for employee dashboard
    private long totalTasks;
    private long todo;
    private long inProgress;
    private long completed;
    private long blocked;
    private long cancelled;
    private long overdue;
}

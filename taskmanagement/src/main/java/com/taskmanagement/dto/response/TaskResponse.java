package com.taskmanagement.dto.response;

import com.taskmanagement.enums.TaskPriority;
import com.taskmanagement.enums.TaskStatus;
import com.taskmanagement.model.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private String id;
    private String title;
    private String description;
    private String assignedTo;
    private String teamId;
    private TaskPriority priority;
    private TaskStatus status;
    private Instant startDate;
    private Instant deadline;
    private String blockedReason;
    private String createdBy;
    private Instant createdDate;
    private Instant updatedDate;
    private Instant completedDate;

    /** Derived, never stored: deadline < now AND status not in {COMPLETED, CANCELLED} (spec section 12). */
    private boolean overdue;

    public static TaskResponse from(Task t) {
        boolean isOverdue = t.getDeadline() != null
                && t.getDeadline().isBefore(Instant.now())
                && t.getStatus() != TaskStatus.COMPLETED
                && t.getStatus() != TaskStatus.CANCELLED;

        return TaskResponse.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .assignedTo(t.getAssignedTo())
                .teamId(t.getTeamId())
                .priority(t.getPriority())
                .status(t.getStatus())
                .startDate(t.getStartDate())
                .deadline(t.getDeadline())
                .blockedReason(t.getBlockedReason())
                .createdBy(t.getCreatedBy())
                .createdDate(t.getCreatedDate())
                .updatedDate(t.getUpdatedDate())
                .completedDate(t.getCompletedDate())
                .overdue(isOverdue)
                .build();
    }
}

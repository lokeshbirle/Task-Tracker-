package com.taskmanagement.dto.request;

import com.taskmanagement.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTaskStatusRequest {
    @NotNull
    private TaskStatus status;

    /** Required when status == BLOCKED (business rule #8). */
    private String blockedReason;
}

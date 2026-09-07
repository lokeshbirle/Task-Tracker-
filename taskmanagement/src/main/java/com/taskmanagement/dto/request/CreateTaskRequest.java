package com.taskmanagement.dto.request;

import com.taskmanagement.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class CreateTaskRequest {
    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String teamId;

    @NotBlank
    private String assignedTo;

    @NotNull
    private TaskPriority priority;

    @NotNull
    private Instant startDate;

    @NotNull
    private Instant deadline;
}

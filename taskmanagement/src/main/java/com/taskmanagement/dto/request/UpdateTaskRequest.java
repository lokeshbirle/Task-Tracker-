package com.taskmanagement.dto.request;

import com.taskmanagement.enums.TaskPriority;
import lombok.Data;

import java.time.Instant;

/** Admin-only: edit task details (not status, not assignment - those have dedicated endpoints). */
@Data
public class UpdateTaskRequest {
    private String title;
    private String description;
    private TaskPriority priority;
    private Instant startDate;
    private Instant deadline;
}

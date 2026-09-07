package com.taskmanagement.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Immutable audit trail entry for a task.
 * e.g. "Lokesh changed status: TODO -> IN_PROGRESS"
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "task_activities")
public class TaskActivity {

    @Id
    private String id;

    @Indexed
    private String taskId;
    private String userId;       // who performed the action
    private String action;       // e.g. "STATUS_CHANGE", "ASSIGNED", "COMMENT_ADDED", "REASSIGNED"
    private String description;  // human-readable summary, e.g. "TODO -> IN_PROGRESS"

    @CreatedDate
    private Instant createdDate;
}

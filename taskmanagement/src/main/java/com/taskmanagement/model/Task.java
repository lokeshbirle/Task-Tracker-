package com.taskmanagement.model;

import com.taskmanagement.enums.TaskPriority;
import com.taskmanagement.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    private String title;

    private String description;

    @Indexed
    private String assignedTo;   // userId

    @Indexed
    private String teamId;

    @Builder.Default
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Builder.Default
    @Indexed
    private TaskStatus status = TaskStatus.TODO;

    private Instant startDate;

    private Instant deadline;

    /** Required when status == BLOCKED. */
    private String blockedReason;

    private String createdBy;   // userId

    @CreatedDate
    private Instant createdDate;

    @LastModifiedDate
    private Instant updatedDate;

    /** Set once, when status transitions to COMPLETED. Never overwritten after. */
    private Instant completedDate;

    /** Soft delete flag - deleted tasks are excluded from all normal queries. */
    @Builder.Default
    private boolean deleted = false;
}

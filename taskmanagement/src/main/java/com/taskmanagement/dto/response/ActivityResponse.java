package com.taskmanagement.dto.response;

import com.taskmanagement.model.TaskActivity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {
    private String id;
    private String taskId;
    private String userId;
    private String userName; // NEW: Added to hold the human-readable name
    private String action;
    private String description;
    private Instant createdDate;

    // Updated to accept the resolved userName
    public static ActivityResponse from(TaskActivity a, String userName) {
        return ActivityResponse.builder()
                .id(a.getId())
                .taskId(a.getTaskId())
                .userId(a.getUserId())
                .userName(userName) // Mapped here
                .action(a.getAction())
                .description(a.getDescription())
                .createdDate(a.getCreatedDate())
                .build();
    }
}
package com.taskmanagement.dto.response;

import com.taskmanagement.model.TaskComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private String id;
    private String taskId;
    private String userId;
    private String text;
    private Instant createdDate;
    private Instant updatedDate;

    public static CommentResponse from(TaskComment c) {
        return CommentResponse.builder()
                .id(c.getId())
                .taskId(c.getTaskId())
                .userId(c.getUserId())
                .text(c.getText())
                .createdDate(c.getCreatedDate())
                .updatedDate(c.getUpdatedDate())
                .build();
    }
}

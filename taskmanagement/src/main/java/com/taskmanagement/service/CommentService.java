package com.taskmanagement.service;

import com.taskmanagement.dto.request.CreateCommentRequest;
import com.taskmanagement.dto.response.CommentResponse;
import com.taskmanagement.exception.UnauthorizedException;
import com.taskmanagement.model.Task;
import com.taskmanagement.model.TaskComment;
import com.taskmanagement.repository.TaskCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final TaskCommentRepository taskCommentRepository;
    private final TaskService taskService;
    private final TaskActivityService taskActivityService;

    public List<CommentResponse> getForTask(String taskId, String requestingUserId, boolean isAdmin) {
        Task task = taskService.getTaskEntity(taskId);
        assertCanAccess(task, requestingUserId, isAdmin);
        return taskCommentRepository.findByTaskIdOrderByCreatedDateAsc(taskId)
                .stream().map(CommentResponse::from).toList();
    }

    public CommentResponse addComment(String taskId, CreateCommentRequest request, String requestingUserId, boolean isAdmin) {
        Task task = taskService.getTaskEntity(taskId);
        assertCanAccess(task, requestingUserId, isAdmin);

        TaskComment comment = TaskComment.builder()
                .taskId(taskId)
                .userId(requestingUserId)
                .text(request.getText())
                .build();
        comment = taskCommentRepository.save(comment);

        taskActivityService.record(taskId, requestingUserId, "COMMENT_ADDED", "Comment added");

        return CommentResponse.from(comment);
    }

    private void assertCanAccess(Task task, String requestingUserId, boolean isAdmin) {
        if (!isAdmin && !task.getAssignedTo().equals(requestingUserId)) {
            throw new UnauthorizedException("You do not have access to this task's comments");
        }
    }
}

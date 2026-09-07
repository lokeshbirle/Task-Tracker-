package com.taskmanagement.controller;

import com.taskmanagement.dto.request.CreateCommentRequest;
import com.taskmanagement.dto.response.CommentResponse;
import com.taskmanagement.security.CurrentUserUtil;
import com.taskmanagement.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable String taskId) {
        return ResponseEntity.ok(commentService.getForTask(taskId, CurrentUserUtil.userId(), CurrentUserUtil.isAdmin()));
    }

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(@PathVariable String taskId, @Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.ok(commentService.addComment(taskId, request, CurrentUserUtil.userId(), CurrentUserUtil.isAdmin()));
    }
}

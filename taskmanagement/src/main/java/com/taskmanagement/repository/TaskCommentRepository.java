package com.taskmanagement.repository;

import com.taskmanagement.model.TaskComment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskCommentRepository extends MongoRepository<TaskComment, String> {
    List<TaskComment> findByTaskIdOrderByCreatedDateAsc(String taskId);
}

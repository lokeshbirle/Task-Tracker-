package com.taskmanagement.repository;

import com.taskmanagement.enums.TaskPriority;
import com.taskmanagement.enums.TaskStatus;
import com.taskmanagement.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {

    List<Task> findByDeletedFalse();

    List<Task> findByAssignedToAndDeletedFalse(String userId);

    List<Task> findByTeamIdAndDeletedFalse(String teamId);

    List<Task> findByAssignedToAndStatusAndDeletedFalse(String userId, TaskStatus status);

    List<Task> findByAssignedToAndPriorityAndDeletedFalse(String userId, TaskPriority priority);

    long countByAssignedToAndDeletedFalse(String userId);

    long countByAssignedToAndStatusAndDeletedFalse(String userId, TaskStatus status);

    long countByStatusAndDeletedFalse(TaskStatus status);

    long countByDeletedFalse();
}

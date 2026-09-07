package com.taskmanagement.repository;

import com.taskmanagement.model.TaskActivity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskActivityRepository extends MongoRepository<TaskActivity, String> {
    List<TaskActivity> findByTaskIdOrderByCreatedDateAsc(String taskId);
}

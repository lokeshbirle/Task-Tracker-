package com.taskmanagement.service;

import com.taskmanagement.dto.response.ActivityResponse;
import com.taskmanagement.model.TaskActivity;
import com.taskmanagement.model.User;
import com.taskmanagement.repository.TaskActivityRepository;
import com.taskmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskActivityService {

    private final TaskActivityRepository taskActivityRepository;
    private final UserRepository userRepository; // NEW: Inject repository to look up names

    public List<ActivityResponse> getForTask(String taskId) {
        return taskActivityRepository.findByTaskIdOrderByCreatedDateAsc(taskId)
                .stream().map(activity -> {
                    // Look up the name. If the user was deleted, fallback to "System / Admin"
                    String userName = userRepository.findById(activity.getUserId())
                            .map(User::getName)
                            .orElse("System / Admin");
                    
                    return ActivityResponse.from(activity, userName);
                }).toList();
    }

    /** rule #10: important task changes are recorded in the activity history. */
    public void record(String taskId, String userId, String action, String description) {
        TaskActivity activity = TaskActivity.builder()
                .taskId(taskId)
                .userId(userId)
                .action(action)
                .description(description)
                .build();
        taskActivityRepository.save(activity);
    }
}
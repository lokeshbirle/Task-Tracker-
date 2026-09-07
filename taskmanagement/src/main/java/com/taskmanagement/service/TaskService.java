package com.taskmanagement.service;

import com.taskmanagement.dto.request.AssignTaskRequest;
import com.taskmanagement.dto.request.CreateTaskRequest;
import com.taskmanagement.dto.request.UpdateTaskRequest;
import com.taskmanagement.dto.request.UpdateTaskStatusRequest;
import com.taskmanagement.dto.response.DashboardStatsResponse;
import com.taskmanagement.dto.response.TaskResponse;
import com.taskmanagement.enums.AccountStatus;
import com.taskmanagement.enums.NotificationType;
import com.taskmanagement.enums.TaskStatus;
import com.taskmanagement.exception.BadRequestException;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.exception.UnauthorizedException;
import com.taskmanagement.model.Task;
import com.taskmanagement.model.User;
import com.taskmanagement.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;
    private final TeamService teamService;
    private final TaskActivityService taskActivityService;
    private final NotificationService notificationService;

    // ---------- Reads ----------

    /** Admin: all non-deleted tasks. */
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findByDeletedFalse().stream().map(TaskResponse::from).toList();
    }

    /** Employee: only their own assigned tasks (spec section 7 / rule "employees only see authorized tasks"). */
    public List<TaskResponse> getTasksForUser(String userId) {
        return taskRepository.findByAssignedToAndDeletedFalse(userId).stream().map(TaskResponse::from).toList();
    }

    public List<TaskResponse> getTasksForTeam(String teamId) {
        return taskRepository.findByTeamIdAndDeletedFalse(teamId).stream().map(TaskResponse::from).toList();
    }

    /** Enforces resource-level access: Admins see any task, employees only their own. */
    public TaskResponse getTaskById(String taskId, String requestingUserId, boolean isAdmin) {
        Task task = getTaskEntity(taskId);
        assertCanView(task, requestingUserId, isAdmin);
        return TaskResponse.from(task);
    }

    public Task getTaskEntity(String taskId) {
        return taskRepository.findById(taskId)
                .filter(t -> !t.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
    }

    // ---------- Admin: create / update / assign / delete ----------

    public TaskResponse createTask(CreateTaskRequest request, String createdByUserId) {
        if (request.getDeadline().isBefore(request.getStartDate())) {
            throw new BadRequestException("Deadline cannot be earlier than the start date"); // rule #3
        }

        User assignee = userService.getUserEntity(request.getAssignedTo());
        if (assignee.getAccountStatus() == AccountStatus.INACTIVE) {
            throw new BadRequestException("Cannot assign a task to an inactive user"); // rule #1
        }
        if (!teamService.isMemberOfTeam(request.getTeamId(), request.getAssignedTo())) {
            throw new BadRequestException("Assigned user is not a member of the selected team"); // rule #2
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .teamId(request.getTeamId())
                .assignedTo(request.getAssignedTo())
                .priority(request.getPriority())
                .status(TaskStatus.TODO)
                .startDate(request.getStartDate())
                .deadline(request.getDeadline())
                .createdBy(createdByUserId)
                .deleted(false)
                .build();

        task = taskRepository.save(task);

        taskActivityService.record(task.getId(), createdByUserId, "ASSIGNED",
                "Task created and assigned to " + assignee.getName());

        notificationService.notify(assignee.getId(), NotificationType.TASK_ASSIGNED,
                "You have been assigned a new task: \"" + task.getTitle() + "\"", task.getId());

        return TaskResponse.from(task);
    }

    public TaskResponse updateTask(String taskId, UpdateTaskRequest request, String requestingUserId) {
        Task task = getTaskEntity(taskId);

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStartDate() != null) task.setStartDate(request.getStartDate());
        if (request.getDeadline() != null) task.setDeadline(request.getDeadline());

        if (task.getDeadline() != null && task.getStartDate() != null
                && task.getDeadline().isBefore(task.getStartDate())) {
            throw new BadRequestException("Deadline cannot be earlier than the start date"); // rule #3
        }

        task = taskRepository.save(task);
        taskActivityService.record(task.getId(), requestingUserId, "UPDATED", "Task details updated");
        return TaskResponse.from(task);
    }

    /** Admin-only reassignment (rule #5: employees cannot change task assignment). */
    public TaskResponse reassignTask(String taskId, AssignTaskRequest request, String requestingUserId) {
        Task task = getTaskEntity(taskId);
        String previousAssignee = task.getAssignedTo();

        User newAssignee = userService.getUserEntity(request.getUserId());
        if (newAssignee.getAccountStatus() == AccountStatus.INACTIVE) {
            throw new BadRequestException("Cannot assign a task to an inactive user"); // rule #1
        }
        if (!teamService.isMemberOfTeam(task.getTeamId(), request.getUserId())) {
            throw new BadRequestException("Assigned user is not a member of the task's team"); // rule #2
        }

        task.setAssignedTo(newAssignee.getId());
        task = taskRepository.save(task);

        // taskActivityService.record(task.getId(), requestingUserId, "REASSIGNED",
        //         "Reassigned from " + previousAssignee + " to " + newAssignee.getId());

        // Resolve the previous assignee's name safely
        String previousAssigneeName = "Unassigned";
        if (previousAssignee != null) {
            try {
                previousAssigneeName = userService.getUserEntity(previousAssignee).getName();
            } catch (Exception e) {
                previousAssigneeName = "Unknown User";
            }
        }

        // Use names in the description instead of IDs
        taskActivityService.record(task.getId(), requestingUserId, "REASSIGNED",
                "Reassigned from " + previousAssigneeName + " to " + newAssignee.getName());


        notificationService.notify(newAssignee.getId(), NotificationType.TASK_ASSIGNED,
                "You have been assigned a new task: \"" + task.getTitle() + "\"", task.getId());
        if (previousAssignee != null) {
            notificationService.notify(previousAssignee, NotificationType.TASK_REASSIGNED,
                    "Your task \"" + task.getTitle() + "\" has been reassigned to " + newAssignee.getName(),
                    task.getId());
        }

        return TaskResponse.from(task);
    }

    /** Soft delete (rule #9). */
    public void deleteTask(String taskId, String requestingUserId) {
        Task task = getTaskEntity(taskId);
        task.setDeleted(true);
        taskRepository.save(task);
        taskActivityService.record(task.getId(), requestingUserId, "DELETED", "Task deleted");
    }

    // ---------- Status updates (Admin or the assigned employee) ----------

    public TaskResponse updateStatus(String taskId, UpdateTaskStatusRequest request, String requestingUserId, boolean isAdmin) {
        Task task = getTaskEntity(taskId);

        // rule #4: employees cannot modify another employee's task
        if (!isAdmin && !task.getAssignedTo().equals(requestingUserId)) {
            throw new UnauthorizedException("You can only update tasks assigned to you");
        }

        if (request.getStatus() == TaskStatus.BLOCKED
                && (request.getBlockedReason() == null || request.getBlockedReason().isBlank())) {
            throw new BadRequestException("A blocking reason is required when marking a task BLOCKED"); // rule #8
        }

        TaskStatus previousStatus = task.getStatus();
        task.setStatus(request.getStatus());
        task.setBlockedReason(request.getStatus() == TaskStatus.BLOCKED ? request.getBlockedReason() : null);

        if (request.getStatus() == TaskStatus.COMPLETED && task.getCompletedDate() == null) {
            task.setCompletedDate(Instant.now()); // rule #11: completion timestamp is set once and retained
        }

        task = taskRepository.save(task);

        taskActivityService.record(task.getId(), requestingUserId, "STATUS_CHANGE",
                previousStatus + " -> " + task.getStatus());

        if (task.getStatus() == TaskStatus.COMPLETED) {
            notificationService.notify(task.getCreatedBy(), NotificationType.TASK_COMPLETED,
                    requestingUserId + " completed: \"" + task.getTitle() + "\"", task.getId());
        }

        return TaskResponse.from(task);
    }

    // ---------- Dashboards ----------

    public DashboardStatsResponse getAdminStats(long totalUsers, long totalTeams) {
        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalTeams(totalTeams)
                .totalTasks(taskRepository.countByDeletedFalse())
                .todo(taskRepository.countByStatusAndDeletedFalse(TaskStatus.TODO))
                .inProgress(taskRepository.countByStatusAndDeletedFalse(TaskStatus.IN_PROGRESS))
                .completed(taskRepository.countByStatusAndDeletedFalse(TaskStatus.COMPLETED))
                .blocked(taskRepository.countByStatusAndDeletedFalse(TaskStatus.BLOCKED))
                .cancelled(taskRepository.countByStatusAndDeletedFalse(TaskStatus.CANCELLED))
                .overdue(countOverdue(taskRepository.findByDeletedFalse()))
                .build();
    }

    public DashboardStatsResponse getEmployeeStats(String userId) {
        List<Task> myTasks = taskRepository.findByAssignedToAndDeletedFalse(userId);
        return DashboardStatsResponse.builder()
                .totalTasks(myTasks.size())
                .todo(count(myTasks, TaskStatus.TODO))
                .inProgress(count(myTasks, TaskStatus.IN_PROGRESS))
                .completed(count(myTasks, TaskStatus.COMPLETED))
                .blocked(count(myTasks, TaskStatus.BLOCKED))
                .cancelled(count(myTasks, TaskStatus.CANCELLED))
                .overdue(countOverdue(myTasks))
                .build();
    }

    private long count(List<Task> tasks, TaskStatus status) {
        return tasks.stream().filter(t -> t.getStatus() == status).count();
    }

    private long countOverdue(List<Task> tasks) {
        Instant now = Instant.now();
        return tasks.stream()
                .filter(t -> t.getDeadline() != null && t.getDeadline().isBefore(now))
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED && t.getStatus() != TaskStatus.CANCELLED)
                .count();
    }

    private void assertCanView(Task task, String requestingUserId, boolean isAdmin) {
        if (!isAdmin && !task.getAssignedTo().equals(requestingUserId)) {
            throw new UnauthorizedException("You do not have access to this task");
        }
    }
}

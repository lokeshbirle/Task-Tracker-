package com.taskmanagement.controller;

import com.taskmanagement.dto.request.AddTeamMemberRequest;
import com.taskmanagement.dto.request.CreateTeamRequest;
import com.taskmanagement.dto.request.UpdateTeamRequest;
import com.taskmanagement.dto.response.TaskResponse;
import com.taskmanagement.dto.response.TeamResponse;
import com.taskmanagement.security.CurrentUserUtil;
import com.taskmanagement.service.TaskService;
import com.taskmanagement.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final TaskService taskService;

    // Any authenticated user can list/view teams (needed for e.g. picking a team in the task-create UI)
    @GetMapping
    public ResponseEntity<List<TeamResponse>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamResponse> getTeam(@PathVariable String id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @GetMapping("/{id}/tasks")
    public ResponseEntity<List<TaskResponse>> getTeamTasks(@PathVariable String id) {
        return ResponseEntity.ok(taskService.getTasksForTeam(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // rule #6: only Admins can create teams
    public ResponseEntity<TeamResponse> createTeam(@Valid @RequestBody CreateTeamRequest request) {
        return ResponseEntity.ok(teamService.createTeam(request, CurrentUserUtil.userId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeamResponse> updateTeam(@PathVariable String id, @RequestBody UpdateTeamRequest request) {
        return ResponseEntity.ok(teamService.updateTeam(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // rule #6: only Admins can delete teams
    public ResponseEntity<Void> deleteTeam(@PathVariable String id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN')") // rule #7: only authorized Admins manage team members
    public ResponseEntity<TeamResponse> addMember(@PathVariable String id, @Valid @RequestBody AddTeamMemberRequest request) {
        return ResponseEntity.ok(teamService.addMember(id, request));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeamResponse> removeMember(@PathVariable String id, @PathVariable String userId) {
        return ResponseEntity.ok(teamService.removeMember(id, userId));
    }
}

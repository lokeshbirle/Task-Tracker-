package com.taskmanagement.service;

import com.taskmanagement.dto.request.AddTeamMemberRequest;
import com.taskmanagement.dto.request.CreateTeamRequest;
import com.taskmanagement.dto.request.UpdateTeamRequest;
import com.taskmanagement.dto.response.TeamResponse;
import com.taskmanagement.enums.AccountStatus;
import com.taskmanagement.enums.TeamStatus;
import com.taskmanagement.exception.BadRequestException;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.model.Team;
import com.taskmanagement.model.User;
import com.taskmanagement.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserService userService;

    public List<TeamResponse> getAllTeams() {
        return teamRepository.findAll().stream().map(TeamResponse::from).toList();
    }

    public TeamResponse getTeamById(String id) {
        return TeamResponse.from(getTeamEntity(id));
    }

    public Team getTeamEntity(String id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + id));
    }

    /** Teams the given user belongs to (used to filter task-assignment eligibility, dashboards, etc.). */
    public List<Team> getTeamsForUser(String userId) {
        return teamRepository.findByMemberIdsContaining(userId);
    }

    public TeamResponse createTeam(CreateTeamRequest request, String createdByUserId) {
        User lead = userService.getUserEntity(request.getTeamLeadId());
        assertActive(lead);

        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .teamLeadId(lead.getId())
                .status(TeamStatus.ACTIVE)
                .createdBy(createdByUserId)
                .build();
        team.getMemberIds().add(lead.getId());

        return TeamResponse.from(teamRepository.save(team));
    }

    public TeamResponse updateTeam(String id, UpdateTeamRequest request) {
        Team team = getTeamEntity(id);

        if (request.getName() != null) team.setName(request.getName());
        if (request.getDescription() != null) team.setDescription(request.getDescription());
        if (request.getTeamLeadId() != null) {
            User lead = userService.getUserEntity(request.getTeamLeadId());
            assertActive(lead);
            team.setTeamLeadId(lead.getId());
            team.getMemberIds().add(lead.getId());
        }

        return TeamResponse.from(teamRepository.save(team));
    }

    public void deleteTeam(String id) {
        Team team = getTeamEntity(id);
        team.setStatus(TeamStatus.INACTIVE); // soft delete, consistent with rule #9
        teamRepository.save(team);
    }

    public TeamResponse addMember(String teamId, AddTeamMemberRequest request) {
        Team team = getTeamEntity(teamId);
        User user = userService.getUserEntity(request.getUserId());
        assertActive(user);

        team.getMemberIds().add(user.getId());
        return TeamResponse.from(teamRepository.save(team));
    }

    public TeamResponse removeMember(String teamId, String userId) {
        Team team = getTeamEntity(teamId);

        if (userId.equals(team.getTeamLeadId())) {
            throw new BadRequestException("Cannot remove the team lead. Assign a new lead first.");
        }

        team.getMemberIds().remove(userId);
        return TeamResponse.from(teamRepository.save(team));
    }

    /** Business rule #2: a task should only be assigned to an eligible member of the selected team. */
    public boolean isMemberOfTeam(String teamId, String userId) {
        Team team = getTeamEntity(teamId);
        return team.getMemberIds().contains(userId);
    }

    private void assertActive(User user) {
        if (user.getAccountStatus() == AccountStatus.INACTIVE) {
            throw new BadRequestException("Cannot assign an inactive user: " + user.getEmail());
        }
    }
}

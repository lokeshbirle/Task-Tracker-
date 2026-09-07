package com.taskmanagement.dto.response;

import com.taskmanagement.enums.TeamStatus;
import com.taskmanagement.model.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponse {
    private String id;
    private String name;
    private String description;
    private String teamLeadId;
    private Set<String> memberIds;
    private TeamStatus status;
    private Instant createdDate;
    private String createdBy;

    public static TeamResponse from(Team t) {
        return TeamResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .description(t.getDescription())
                .teamLeadId(t.getTeamLeadId())
                .memberIds(t.getMemberIds())
                .status(t.getStatus())
                .createdDate(t.getCreatedDate())
                .createdBy(t.getCreatedBy())
                .build();
    }
}

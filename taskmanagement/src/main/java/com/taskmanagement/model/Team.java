package com.taskmanagement.model;

import com.taskmanagement.enums.TeamStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "teams")
public class Team {

    @Id
    private String id;

    private String name;

    private String description;

    /** userId of the team lead / manager */
    private String teamLeadId;

    /** userIds of team members (includes the lead, for query convenience) */
    @Builder.Default
    private Set<String> memberIds = new HashSet<>();

    @Builder.Default
    private TeamStatus status = TeamStatus.ACTIVE;

    @CreatedDate
    private Instant createdDate;

    private String createdBy;
}

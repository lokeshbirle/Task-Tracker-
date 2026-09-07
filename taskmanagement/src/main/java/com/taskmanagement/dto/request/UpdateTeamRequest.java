package com.taskmanagement.dto.request;

import lombok.Data;

@Data
public class UpdateTeamRequest {
    private String name;
    private String description;
    private String teamLeadId;
}

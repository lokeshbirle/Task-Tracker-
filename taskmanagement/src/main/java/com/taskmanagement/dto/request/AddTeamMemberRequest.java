package com.taskmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddTeamMemberRequest {
    @NotBlank
    private String userId;
}

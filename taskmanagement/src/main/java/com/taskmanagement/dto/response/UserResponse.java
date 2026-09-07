package com.taskmanagement.dto.response;

import com.taskmanagement.enums.AccountStatus;
import com.taskmanagement.enums.Role;
import com.taskmanagement.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/** Never includes the password hash. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private Role role;
    private String designation;
    private AccountStatus accountStatus;
    private Instant createdDate;
    private Instant lastLogin;

    public static UserResponse from(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .designation(u.getDesignation())
                .accountStatus(u.getAccountStatus())
                .createdDate(u.getCreatedDate())
                .lastLogin(u.getLastLogin())
                .build();
    }
}

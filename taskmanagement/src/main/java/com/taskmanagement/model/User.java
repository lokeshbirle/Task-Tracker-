package com.taskmanagement.model;

import com.taskmanagement.enums.AccountStatus;
import com.taskmanagement.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    /** BCrypt hash. Never returned in API responses. */
    private String password;

    @Builder.Default
    private Role role = Role.EMPLOYEE;

    private String designation;

    @Builder.Default
    private AccountStatus accountStatus = AccountStatus.ACTIVE;

    @CreatedDate
    private Instant createdDate;

    private Instant lastLogin;
}

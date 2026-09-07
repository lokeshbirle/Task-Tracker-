package com.taskmanagement.service;

import com.taskmanagement.dto.request.CreateUserRequest;
import com.taskmanagement.dto.request.UpdateUserRequest;
import com.taskmanagement.dto.response.UserResponse;
import com.taskmanagement.enums.AccountStatus;
import com.taskmanagement.exception.BadRequestException;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.model.User;
import com.taskmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(UserResponse::from).toList();
    }

    public UserResponse getUserById(String id) {
        return UserResponse.from(getUserEntity(id));
    }

    public User getUserEntity(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .designation(request.getDesignation())
                .accountStatus(AccountStatus.ACTIVE)
                .build();

        return UserResponse.from(userRepository.save(user));
    }

    public UserResponse updateUser(String id, UpdateUserRequest request) {
        User user = getUserEntity(id);

        if (request.getName() != null) user.setName(request.getName());
        if (request.getDesignation() != null) user.setDesignation(request.getDesignation());

        return UserResponse.from(userRepository.save(user));
    }

    public UserResponse updateStatus(String id, AccountStatus status) {
        User user = getUserEntity(id);
        user.setAccountStatus(status);
        // Business rule #12: deactivated users lose access immediately.
        // Existing JWTs remain cryptographically valid until expiry, but JwtAuthFilter
        // checks isEnabled() on every request, so access is denied on the very next call.
        return UserResponse.from(userRepository.save(user));
    }
}

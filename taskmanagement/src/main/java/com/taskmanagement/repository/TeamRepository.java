package com.taskmanagement.repository;

import com.taskmanagement.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TeamRepository extends MongoRepository<Team, String> {
    List<Team> findByMemberIdsContaining(String userId);
}

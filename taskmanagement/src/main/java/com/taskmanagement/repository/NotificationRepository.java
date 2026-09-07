package com.taskmanagement.repository;

import com.taskmanagement.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedDateDesc(String userId);
    List<Notification> findByUserIdAndReadFalseOrderByCreatedDateDesc(String userId);
}

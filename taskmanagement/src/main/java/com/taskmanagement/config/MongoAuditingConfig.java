package com.taskmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/** Enables @CreatedDate / @LastModifiedDate handling on documents. */
@Configuration
@EnableMongoAuditing
public class MongoAuditingConfig {
}

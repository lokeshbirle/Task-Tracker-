package com.taskmanagement.exception;

/** Thrown for authorization failures the request-level RBAC didn't already catch (e.g. resource ownership). */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}

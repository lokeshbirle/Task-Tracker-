package com.taskmanagement.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

/** Small helper so controllers don't repeat SecurityContext boilerplate. */
public final class CurrentUserUtil {

    private CurrentUserUtil() {}

    public static UserPrincipal get() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) auth.getPrincipal();
    }

    public static String userId() {
        return get().getId();
    }

    public static boolean isAdmin() {
        return get().getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }
}

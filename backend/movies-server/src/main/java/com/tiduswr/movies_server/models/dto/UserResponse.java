package com.tiduswr.movies_server.models.dto;

import com.tiduswr.movies_server.models.User;

public record UserResponse(
    String user_id,
    String username,
    String name
){
    public static UserResponse from(User user){
        return new UserResponse(
            user.getUserId().toString(), 
            user.getUsername(), 
            user.getName()
        );
    }
}

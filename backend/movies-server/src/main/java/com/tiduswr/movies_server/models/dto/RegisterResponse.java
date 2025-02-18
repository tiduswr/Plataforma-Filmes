package com.tiduswr.movies_server.models.dto;

import com.tiduswr.movies_server.models.User;

public record RegisterResponse(
    String user_id,
    String username,
    String name
){
    public static RegisterResponse from(User user){
        return new RegisterResponse(
            user.getUserId().toString(), 
            user.getUsername(), 
            user.getName()
        );
    }
}

package com.tiduswr.movies_server.entities.dto;

import com.tiduswr.movies_server.entities.User;

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

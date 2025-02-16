package com.tiduswr.movies_server.entities.dto;

public record RegisterResponse(
    String user_id,
    String username,
    String name
){}

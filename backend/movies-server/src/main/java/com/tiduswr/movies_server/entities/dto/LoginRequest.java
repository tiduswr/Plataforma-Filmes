package com.tiduswr.movies_server.entities.dto;

public record LoginRequest(
    String username, 
    String password
){}
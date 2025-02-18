package com.tiduswr.movies_server.models.dto;

public record LoginRequest(
    String username, 
    String password
){}
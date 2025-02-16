package com.tiduswr.movies_server.entities.dto;

public record LoginResponse(
    String accessToken,
    long expiresIn
){}

package com.tiduswr.movies_server.models.dto;

public record LoginResponse(
    String accessToken,
    long expiresIn
){}

package com.tiduswr.movies_server.controller.dto;

public record LoginResponse(
    String accessToken,
    long expiresIn
){}

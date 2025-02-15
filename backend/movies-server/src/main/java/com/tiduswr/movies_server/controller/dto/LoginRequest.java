package com.tiduswr.movies_server.controller.dto;

public record LoginRequest(
    String username, 
    String password
){}
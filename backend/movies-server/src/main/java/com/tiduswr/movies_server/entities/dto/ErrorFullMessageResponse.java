package com.tiduswr.movies_server.entities.dto;

public record ErrorFullMessageResponse(
    String message,
    String fullMessage
){}

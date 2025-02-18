package com.tiduswr.movies_server.models.dto;

public record ErrorFullMessageResponse(
    String message,
    String fullMessage
){}

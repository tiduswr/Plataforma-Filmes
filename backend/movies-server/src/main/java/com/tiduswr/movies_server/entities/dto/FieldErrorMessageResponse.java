package com.tiduswr.movies_server.entities.dto;

public record FieldErrorMessageResponse(
    String field,
    String message
) {}

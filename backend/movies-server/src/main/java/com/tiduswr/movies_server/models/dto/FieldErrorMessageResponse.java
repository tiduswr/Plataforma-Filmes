package com.tiduswr.movies_server.models.dto;

public record FieldErrorMessageResponse(
    String field,
    String message
) {}

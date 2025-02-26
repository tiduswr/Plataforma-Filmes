package com.tiduswr.movies_server.models.dto;

public record VideoValidated(
    String videoTime,
    boolean valid
) {}

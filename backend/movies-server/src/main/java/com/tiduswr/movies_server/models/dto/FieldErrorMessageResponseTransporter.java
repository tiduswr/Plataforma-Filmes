package com.tiduswr.movies_server.models.dto;

import java.util.List;

public record FieldErrorMessageResponseTransporter(
    List<FieldErrorMessageResponse> fields
) {}

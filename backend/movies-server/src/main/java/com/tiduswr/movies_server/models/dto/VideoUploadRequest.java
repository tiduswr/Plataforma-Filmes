package com.tiduswr.movies_server.models.dto;

import jakarta.validation.constraints.Size;

public record VideoUploadRequest(
    @Size(min = 5, max = 100)
    String title,

    @Size(min = 5)
    String description
) {}

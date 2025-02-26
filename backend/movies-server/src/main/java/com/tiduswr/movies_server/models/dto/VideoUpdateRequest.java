package com.tiduswr.movies_server.models.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Size;

public record VideoUpdateRequest(

    @Size(min = 5, max = 100)
    @Nullable
    String title,

    @Size(min = 5)
    @Nullable
    String description,

    @Nullable
    Boolean visible

) {}

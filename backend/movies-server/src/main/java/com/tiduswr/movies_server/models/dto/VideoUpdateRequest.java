package com.tiduswr.movies_server.models.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Size;

public record VideoUpdateRequest(

    @Size(min = 5, max = 100, message = "O titulo precisa ter no minimo 5 caracteres e no máximo 100")
    @Nullable
    String title,

    @Size(min = 5, message = "A descrição precisa ter no minimo 5 caracteres")
    @Nullable
    String description,

    @Nullable
    Boolean visible

) {}

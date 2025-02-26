package com.tiduswr.movies_server.models.dto;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record VideoUploadRequest(
    @Size(min = 5, max = 100)
    @NotNull(message = "O campo de titulo é obrigatório")
    String title,

    @Size(min = 5)
    @NotNull(message = "O campo de descrição é obrigatório")
    String description,

    @NotNull(message = "O campo de visibilidade é obrigatório")
    Boolean visible
) {}

package com.tiduswr.movies_server.models.dto;

import com.tiduswr.movies_server.validators.Password;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Size;

public record UpdateRequest(

    @Nullable
    @Size(min = 5, max = 30, message = "O campo username precisa ter no mínimo 5 e no máximo 30 caracteres")
    String username,

    @Password(nullable = true)
    String password,

    @Nullable
    @Size(min = 5, max = 125, message = "O campo nome precisa ter no mínimo 5 e no máximo 30 caracteres")
    String name

) {}

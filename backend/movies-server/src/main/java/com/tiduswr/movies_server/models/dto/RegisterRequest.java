package com.tiduswr.movies_server.models.dto;

import com.tiduswr.movies_server.validators.Password;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    
    @NotNull(message = "O campo username é obrigatório")
    @Size(min = 5, max = 30, message = "O campo username precisa ter no mínimo 5 e no máximo 30 caracteres")
    String username,

    @NotNull(message = "O campo senha é obrigatória")
    @Password
    String password,

    @NotNull(message = "O campo nome é obrigatório")
    @Size(min = 5, max = 125, message = "O campo nome precisa ter no mínimo 5 e no máximo 30 caracteres")
    String name
    
) {}

package com.tiduswr.movies_server.models.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LoginRequest(
    @NotNull(message = "O campo username é obrigatório")
    @Size(min = 5, max = 30, message = "O campo username precisa ter no mínimo 5 e no máximo 30 caracteres")
    String username,
    
    @NotNull(message = "O campo username é obrigatório")
    @Size(min = 7, max = 128, message = "O campo senha precisa ter no mínimo 7 e no máximo 128 caracteres") 
    String password
){}

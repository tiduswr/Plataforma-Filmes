package com.tiduswr.movies_server.models.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CommentRequest(

    @NotNull(message = "O comentário não pode estar vazio")
    @NotBlank(message = "O comentário não pode estar vazio")
    String content

) {}

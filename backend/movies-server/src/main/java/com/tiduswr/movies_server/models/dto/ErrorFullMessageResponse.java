package com.tiduswr.movies_server.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ErrorFullMessageResponse(
    String message,
    @JsonProperty("full_message")
    String fullMessage
){}

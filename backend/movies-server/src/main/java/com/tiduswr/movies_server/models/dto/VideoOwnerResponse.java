package com.tiduswr.movies_server.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tiduswr.movies_server.models.User;

public record VideoOwnerResponse(
    @JsonProperty("user_id")
    String userId,
    String username,
    String name
) {

    public static VideoOwnerResponse from(User owner) {
        return new VideoOwnerResponse(owner.getUserId().toString(), owner.getUsername(), owner.getName());
    }}

package com.tiduswr.movies_server.models.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tiduswr.movies_server.models.ImageType;
import com.tiduswr.movies_server.models.User;

public record PrivateUserResponse(
    String user_id,
    String username,
    String name,
    @JsonProperty("image_path")
    List<String> imagePath
){
    public static PrivateUserResponse from(User user, boolean hasImage){
        var userId = user.getUserId().toString();
        var images = hasImage ? List.of(
            "/users/profile-image/" + userId + "/" + ImageType.BIG.name().toLowerCase(),
            "/users/profile-image/" + userId + "/" + ImageType.SMALL.name().toLowerCase()
        ) : null;

        return new PrivateUserResponse(
            userId, 
            user.getUsername(), 
            user.getName(),
            images
        );
    }
}
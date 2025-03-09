package com.tiduswr.movies_server.models.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tiduswr.movies_server.models.ImageType;
import com.tiduswr.movies_server.models.User;

public record CommentOwnerResponse(
    @JsonProperty("user_id")
    String userId,
    String username,
    String name,
    @JsonProperty("image_path")
    List<String> imagePath
) {

    public static CommentOwnerResponse from(User owner, boolean hasImage){
        var userId = owner.getUserId().toString();
        var images = hasImage ? List.of(
            "/users/profile-image/" + userId + "/" + ImageType.BIG.name().toLowerCase(),
            "/users/profile-image/" + userId + "/" + ImageType.SMALL.name().toLowerCase()
        ) : null;
        return new CommentOwnerResponse(owner.getUserId().toString(), 
        owner.getUsername(), owner.getName(), images);
    }}

package com.tiduswr.movies_server.models.dto;

import java.util.List;

import com.tiduswr.movies_server.models.User;
import com.tiduswr.movies_server.models.UserImageType;

public record PrivateUserResponse(
    String user_id,
    String username,
    String name,
    List<String> imagePath
){
    public static PrivateUserResponse from(User user, boolean hasImage){
        var userId = user.getUserId().toString();
        var images = hasImage ? List.of(
            "/users/profile-image/" + userId + "/" + UserImageType.BIG.name().toLowerCase(),
            "/users/profile-image/" + userId + "/" + UserImageType.SMALL.name().toLowerCase()
        ) : null;

        return new PrivateUserResponse(
            userId, 
            user.getUsername(), 
            user.getName(),
            images
        );
    }
}
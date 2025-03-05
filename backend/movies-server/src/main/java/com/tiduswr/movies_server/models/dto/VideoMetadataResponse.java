package com.tiduswr.movies_server.models.dto;

import java.util.UUID;

import com.tiduswr.movies_server.models.VideoMetadata;

public record VideoMetadataResponse(
    UUID videoId,
    String title,
    String description,
    String duration,
    Long likeCount,
    Long views,
    VideoOwnerResponse owner
) {
    public static VideoMetadataResponse from(VideoMetadata v){
        var owner = VideoOwnerResponse.from(v.getOwner());

        return new VideoMetadataResponse(
            v.getVideoId(), 
            v.getTitle(), 
            v.getDescription(), 
            v.getDuration(),
            v.getLikeCount(), 
            v.getViews(), 
            owner
        );
    }
}

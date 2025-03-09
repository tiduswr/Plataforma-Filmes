package com.tiduswr.movies_server.models.dto;

import java.util.UUID;

import com.tiduswr.movies_server.models.VideoMetadata;

public record VideoMetadataResponse(
    UUID video_id,
    String title,
    String description,
    String duration,
    Long likeCount,
    Long views,
    VideoOwnerResponse owner,
    Boolean visible
) {
    public static VideoMetadataResponse from(VideoMetadata v, boolean userHasImage){
        var owner = VideoOwnerResponse.from(v.getOwner(), userHasImage);

        return new VideoMetadataResponse(
            v.getVideoId(), 
            v.getTitle(), 
            v.getDescription(), 
            v.getDuration(),
            v.getLikeCount(), 
            v.getViews(), 
            owner,
            v.getVisible()
        );
    }
}

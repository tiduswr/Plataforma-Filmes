package com.tiduswr.movies_server.models.dto;

import java.util.UUID;

import com.tiduswr.movies_server.models.VideoMetadata;

public record UserVideoMetadataResponse(
    UUID video_id,
    String title,
    String description,
    String duration,
    Long views,
    String progress_information,
    Integer progress_percentage,
    String status,
    Boolean visible
) {
    public static UserVideoMetadataResponse from(VideoMetadata v){
        return new UserVideoMetadataResponse(
            v.getVideoId(), 
            v.getTitle(), 
            v.getDescription(), 
            v.getDuration(),
            v.getViews(),
            v.getProgressInformation(),
            v.getProgressPercentage(),
            v.getStatus().getName(),
            v.getVisible()
        );
    }
}

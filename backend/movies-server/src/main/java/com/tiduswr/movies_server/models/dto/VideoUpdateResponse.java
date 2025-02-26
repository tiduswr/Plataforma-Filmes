package com.tiduswr.movies_server.models.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tiduswr.movies_server.models.VideoMetadata;

public record VideoUpdateResponse(

    @JsonProperty("video_id")
    String videoId,

    String title,

    String description,

    Boolean visible

) {

    public static VideoUpdateResponse from(VideoMetadata videoMetadata) {
        return new VideoUpdateResponse(
            videoMetadata.getVideoId().toString(), 
            videoMetadata.getTitle(), 
            videoMetadata.getDescription(), 
            videoMetadata.getVisible()
        );
    }}

package com.tiduswr.movies_server.config.minio;

public enum MinioBuckets {
    USER_IMAGE_PROCESSING("user-image-proc"),
    USER_IMAGE("user-image"),
    VIDEO_PROCESSING("video-proc"),
    VIDEOS("videos");

    private final String bucket;

    MinioBuckets(String bucket){
        this.bucket = bucket;
    }

    public String getBucketName(){
        return bucket;
    }
}

package com.tiduswr.movies_server.config.minio;

public enum MinioBuckets {
    USER_IMAGE_PROCESSING("user-image-proc");

    private final String bucket;

    MinioBuckets(String bucket){
        this.bucket = bucket;
    }

    public String getBucketName(){
        return bucket;
    }
}

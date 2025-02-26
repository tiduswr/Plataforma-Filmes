package com.tiduswr.movies_server.exceptions;

public class VideoProcessingException extends RuntimeException{
    public VideoProcessingException(String message){
        super(message);
    }
}
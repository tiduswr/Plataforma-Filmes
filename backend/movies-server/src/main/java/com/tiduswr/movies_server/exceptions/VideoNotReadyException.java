package com.tiduswr.movies_server.exceptions;

public class VideoNotReadyException extends RuntimeException{
    public VideoNotReadyException(String message){
        super(message);
    }
}

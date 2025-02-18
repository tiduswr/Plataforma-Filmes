package com.tiduswr.movies_server.exceptions;

public class ImageProcessingException extends RuntimeException{
    public ImageProcessingException(String message){
        super(message);
    }
}

package com.tiduswr.movies_server.exceptions;

public class ResourceNotAllowedException extends RuntimeException{
    public ResourceNotAllowedException(String message){
        super(message);
    }
}

package com.tiduswr.movies_server.exceptions;

public class ConflictException extends RuntimeException{
    
    public ConflictException(String message){
        super(message);
    }

}

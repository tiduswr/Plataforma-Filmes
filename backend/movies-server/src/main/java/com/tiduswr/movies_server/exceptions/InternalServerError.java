package com.tiduswr.movies_server.exceptions;

public class InternalServerError extends RuntimeException{
    public InternalServerError(String message){
        super(message);
    }
}

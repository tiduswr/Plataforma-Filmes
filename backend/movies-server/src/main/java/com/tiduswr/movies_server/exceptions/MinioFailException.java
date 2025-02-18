package com.tiduswr.movies_server.exceptions;

public class MinioFailException extends RuntimeException{

    private final Exception exception;

    public MinioFailException(String message, Exception exception){
        super(message);
        this.exception = exception;
    }

    public String getFullMessage(){
        return exception.getMessage();
    }

    public Exception getException(){
        return exception;
    }

}

package com.tiduswr.movies_server.exceptions;

public class JsonProcessingFailException extends RuntimeException {
    public JsonProcessingFailException(String message){
        super(message);
    }
}

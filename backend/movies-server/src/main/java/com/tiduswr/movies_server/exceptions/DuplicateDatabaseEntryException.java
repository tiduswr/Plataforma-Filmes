package com.tiduswr.movies_server.exceptions;

public class DuplicateDatabaseEntryException extends RuntimeException{
    public DuplicateDatabaseEntryException(String message){
        super(message);
    }
}

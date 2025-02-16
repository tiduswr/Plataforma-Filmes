package com.tiduswr.movies_server.exceptions;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.tiduswr.movies_server.entities.dto.ErrorMessageResponse;
import com.tiduswr.movies_server.entities.dto.FieldErrorMessageResponse;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorMessageResponse> handleBadCredentials(BadCredentialsException ex){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMessageResponse(ex.getMessage()));
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorMessageResponse> handleConflict(ConflictException ex){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMessageResponse(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<FieldErrorMessageResponse>> handleValidationExceptions(MethodArgumentNotValidException ex) {

        var errors = ex.getBindingResult().getAllErrors().stream()
            .map(error -> 
                new FieldErrorMessageResponse(
                    ((FieldError) error).getField(), 
                    error.getDefaultMessage()
                )
            )
            .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

}

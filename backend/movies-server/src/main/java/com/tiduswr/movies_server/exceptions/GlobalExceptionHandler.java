package com.tiduswr.movies_server.exceptions;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.amqp.AmqpException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MultipartException;

import com.tiduswr.movies_server.models.dto.ErrorFullMessageResponse;
import com.tiduswr.movies_server.models.dto.ErrorMessageResponse;
import com.tiduswr.movies_server.models.dto.FieldErrorMessageResponse;

import io.minio.errors.MinioException;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorMessageResponse> handleBadCredentials(BadCredentialsException ex){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMessageResponse(ex.getMessage()));
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorMessageResponse> handleBadCredentials(NotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessageResponse(ex.getMessage()));
    }

    @ExceptionHandler({ConflictException.class, DuplicateDatabaseEntryException.class})
    public ResponseEntity<ErrorMessageResponse> handleConflict(RuntimeException ex){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorMessageResponse(ex.getMessage()));
    }

    @ExceptionHandler(MinioFailException.class)
    public ResponseEntity<ErrorFullMessageResponse> handleUploadFail(MinioFailException ex){

        var genericException = ex.getException();
        HttpStatusCode statusCode;
        String message;

        if (genericException instanceof IOException || genericException instanceof IllegalArgumentException) {
            statusCode = HttpStatus.BAD_REQUEST;
            message = "Erro ao ler o arquivo";
        } else if (genericException instanceof MinioException) {
            statusCode = HttpStatus.SERVICE_UNAVAILABLE;
            message = "Erro no serviço de armazenamento";
        }else{
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            message = "Erro inesperado ao fazer upload";
        }

        return ResponseEntity.status(statusCode).body(new ErrorFullMessageResponse(message, ex.getFullMessage()));
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

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ErrorMessageResponse> handleMultipartException(MultipartException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorMessageResponse("Solicitação inválida: É necessário enviar um arquivo do tipo 'multipart/form-data'."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorFullMessageResponse> handleGeneralException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorFullMessageResponse("Erro interno", ex.getMessage()));
    }
    
    @ExceptionHandler(AmqpException.class)
    public ResponseEntity<ErrorFullMessageResponse> handleAmqpException(AmqpException ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorFullMessageResponse("Erro de comunicação com o RabbitMQ", ex.getMessage()));
    }

    @ExceptionHandler(JsonProcessingFailException.class)
    public ResponseEntity<ErrorFullMessageResponse> handleJsonProcessingFail(JsonProcessingFailException ex){
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorFullMessageResponse("Erro na conversão: Object -> JSON", ex.getMessage()));
    }

    @ExceptionHandler(ImageProcessingException.class)
    public ResponseEntity<ErrorFullMessageResponse> handleJsonProcessingFail(ImageProcessingException ex){
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorFullMessageResponse("Erro no processamento da imagem", ex.getMessage()));
    }

}

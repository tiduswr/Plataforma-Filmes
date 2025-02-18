package com.tiduswr.movies_server.controller;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tiduswr.movies_server.exceptions.ImageProcessingException;
import com.tiduswr.movies_server.models.dto.RegisterRequest;
import com.tiduswr.movies_server.models.dto.RegisterResponse;
import com.tiduswr.movies_server.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserService userService;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
        "image/jpeg", "image/png", "image/webp", "image/jpg"
    );

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/basic/register")    
    public ResponseEntity<RegisterResponse> newUser(@Valid @RequestBody RegisterRequest registerRequest){

        var response = userService.basicUserRegister(registerRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/profile-image")
    public ResponseEntity<Void> publishImageTask(
        @RequestParam("file") MultipartFile image, 
        @AuthenticationPrincipal Jwt authContext
    ){
        if(image == null || image.isEmpty())
            throw new ImageProcessingException("Imagem vazia");
        
        final var contentType = image.getContentType();
        if(contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)){
            throw new ImageProcessingException("Precisa ser uma imagem no formato jpeg, jpg, png ou webp");
        }

        String userId = authContext.getSubject();
        userService.publishUserImageTask(userId, image);

        return ResponseEntity.ok().build();
    }

}

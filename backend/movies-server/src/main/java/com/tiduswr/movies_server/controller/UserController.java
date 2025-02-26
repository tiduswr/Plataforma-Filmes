package com.tiduswr.movies_server.controller;

import java.io.IOException;
import java.util.Set;

import org.apache.tika.Tika;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tiduswr.movies_server.exceptions.ImageProcessingException;
import com.tiduswr.movies_server.models.ImageType;
import com.tiduswr.movies_server.models.dto.PrivateUserResponse;
import com.tiduswr.movies_server.models.dto.RegisterRequest;
import com.tiduswr.movies_server.models.dto.UpdateRequest;
import com.tiduswr.movies_server.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserService userService;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
        "image/jpeg", "image/png", "image/webp", "image/jpg"
    );
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/basic/register")    
    public ResponseEntity<PrivateUserResponse> newUser(@Valid @RequestBody RegisterRequest registerRequest){

        var response = userService.basicUserRegister(registerRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/update")
    public ResponseEntity<PrivateUserResponse> updateUser(
        @Valid @RequestBody UpdateRequest updateRequest,
        @AuthenticationPrincipal Jwt jwt
    ){

        var userId = jwt.getSubject();
        var response = userService.basicUserUpdate(updateRequest, userId);

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/me")    
    public ResponseEntity<PrivateUserResponse> getMe(@AuthenticationPrincipal Jwt jwt){
        String userId = jwt.getSubject();
        PrivateUserResponse user = userService.getPrivateUserData(userId);

        return ResponseEntity.ok().body(user);
    }

    @PutMapping("/profile-image")
    public ResponseEntity<Void> publishImageTask(
        @RequestParam("file") MultipartFile image, 
        @AuthenticationPrincipal Jwt authContext
    ){
        if(image == null || image.isEmpty())
            throw new ImageProcessingException("Imagem vazia");
        
        if(image.getSize() > MAX_FILE_SIZE)
            throw new ImageProcessingException("A imagem não pode exceder 50mb");

        Tika tika = new Tika();
        String detectedType;
        try {
            detectedType = tika.detect(image.getInputStream());
        } catch (IOException e) {
            throw new ImageProcessingException("Imagem corrompida ou formato desconhecido");
        }

        if(!ALLOWED_CONTENT_TYPES.contains(detectedType)){
            throw new ImageProcessingException("Precisa ser uma imagem no formato jpeg, jpg, png ou webp");
        }

        String userId = authContext.getSubject();
        userService.publishUserImageTask(userId, image);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile-image/{userId}/{type}")
    public ResponseEntity<byte[]> getImage(@PathVariable("userId") String userId, @PathVariable("type") ImageType type) {
        byte[] imageBytes = userService.readUserImage(userId, type);
        
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(imageBytes);
    }
}

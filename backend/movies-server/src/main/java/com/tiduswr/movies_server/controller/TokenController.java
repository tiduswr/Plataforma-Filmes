package com.tiduswr.movies_server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tiduswr.movies_server.entities.dto.LoginRequest;
import com.tiduswr.movies_server.entities.dto.LoginResponse;
import com.tiduswr.movies_server.service.TokenService;

import lombok.AllArgsConstructor;


@RestController
@AllArgsConstructor
public class TokenController {
    
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        
        var response = tokenService.tokenGenerate(loginRequest);

        return ResponseEntity.ok().body(response);
    }
    

}

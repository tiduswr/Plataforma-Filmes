package com.tiduswr.movies_server.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tiduswr.movies_server.entities.dto.RegisterRequest;
import com.tiduswr.movies_server.entities.dto.RegisterResponse;
import com.tiduswr.movies_server.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;


@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {
    
    private UserService userService;

    @PostMapping("/register")    
    public ResponseEntity<RegisterResponse> newUser(@Valid @RequestBody RegisterRequest registerRequest){

        var response = userService.basicUserRegister(registerRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}

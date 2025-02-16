package com.tiduswr.movies_server.service;

import java.util.Set;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.tiduswr.movies_server.entities.Role;
import com.tiduswr.movies_server.entities.User;
import com.tiduswr.movies_server.entities.dto.RegisterRequest;
import com.tiduswr.movies_server.entities.dto.RegisterResponse;
import com.tiduswr.movies_server.exceptions.ConflictException;
import com.tiduswr.movies_server.exceptions.InternalServerError;
import com.tiduswr.movies_server.repository.RoleRepository;
import com.tiduswr.movies_server.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
    
    private UserRepository userRepository;
    private BCryptPasswordEncoder encoder;
    private RoleRepository roleRepository;

    public RegisterResponse basicUserRegister(RegisterRequest request){

        var roleBasic = roleRepository.findByName(Role.Values.USER.name()).orElseThrow(
            () -> new InternalServerError("Role USER não encontrada!")
        );

        userRepository
            .findByUsername(request.username())
            .ifPresent(
                user -> {
                    throw new ConflictException("O usuário já existe!");
                }
            );

        var newUser = User.builder()
            .name(request.name())
            .username(request.username())
            .password(encoder.encode(request.password()))
            .roles(Set.of(roleBasic))
        .build();
        var savedUser = userRepository.save(newUser);

        return new RegisterResponse(
            savedUser.getUserId().toString(), 
            savedUser.getUsername(), 
            savedUser.getName()
        );
    }

}

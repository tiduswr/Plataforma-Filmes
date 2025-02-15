package com.tiduswr.movies_server.controller;

import java.time.Instant;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tiduswr.movies_server.controller.dto.LoginRequest;
import com.tiduswr.movies_server.controller.dto.LoginResponse;
import com.tiduswr.movies_server.repository.UserRepository;


@RestController
public class TokenController {
    
    private JwtEncoder jwtEncoder;
    private BCryptPasswordEncoder encoder;
    private UserRepository userRepository;

    public TokenController(JwtEncoder jwtEncoder, UserRepository userRepository, BCryptPasswordEncoder encoder){
        this.jwtEncoder = jwtEncoder;
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        var user = userRepository.findByUsername(loginRequest.username());
        
        if(user.isEmpty() || !user.get().isLoginCorrect(loginRequest, encoder)){
            throw new BadCredentialsException("Usuário ou senha inválidos");
        }

        var now = Instant.now();
        var expiresIn = 300L;

        var claims = JwtClaimsSet.builder()
            .issuer("PlatFilmes")
            .subject(user.get().getUserUuid().toString())
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expiresIn))
            .build();
        
        var jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return ResponseEntity.ok(new LoginResponse(jwtValue, expiresIn));
    }
    

}

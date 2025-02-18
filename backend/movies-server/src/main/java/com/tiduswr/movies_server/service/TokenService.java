package com.tiduswr.movies_server.service;

import java.time.Instant;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.tiduswr.movies_server.entities.dto.LoginRequest;
import com.tiduswr.movies_server.entities.dto.LoginResponse;
import com.tiduswr.movies_server.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TokenService {
    
    private final JwtEncoder jwtEncoder;
    private final BCryptPasswordEncoder encoder;
    private final UserRepository userRepository;

    public LoginResponse tokenGenerate(LoginRequest loginRequest){
        var user = userRepository.findByUsername(loginRequest.username());
        
        if(user.isEmpty() || !user.get().isLoginCorrect(loginRequest, encoder)){
            throw new BadCredentialsException("Usuário ou senha inválidos");
        }

        final Instant now = Instant.now();
        final long expiresIn = 8600; // Em produção seria melhor usar access e refresh tokens

        var claims = JwtClaimsSet.builder()
            .issuer("PlatFilmes")
            .subject(user.get().getUserId().toString())
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expiresIn))
            .claim("roles", user.get().getRoles())
            .build();
        
        var jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return new LoginResponse(jwtValue, expiresIn);
    }

}

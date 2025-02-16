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
    
    private JwtEncoder jwtEncoder;
    private BCryptPasswordEncoder encoder;
    private UserRepository userRepository;

    public LoginResponse tokenGenerate(LoginRequest loginRequest){
        var user = userRepository.findByUsername(loginRequest.username());
        
        if(user.isEmpty() || !user.get().isLoginCorrect(loginRequest, encoder)){
            throw new BadCredentialsException("Usuário ou senha inválidos");
        }

        var now = Instant.now();
        var expiresIn = 300L;

        var claims = JwtClaimsSet.builder()
            .issuer("PlatFilmes")
            .subject(user.get().getUserId().toString())
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expiresIn))
            .build();
        
        var jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return new LoginResponse(jwtValue, expiresIn);
    }

}

package com.tiduswr.movies_server.config;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Value("${jwt.public.key}")
    private RSAPublicKey pubKey;

    @Value("${jwt.private.key}")
    private RSAPrivateKey privKey;

    @Value("${app.security.csrf:true}")
    private boolean csrfEnabled;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        http
            .authorizeHttpRequests(
                authorize -> authorize
                    .requestMatchers(HttpMethod.POST, "/login").permitAll()
                    .requestMatchers(HttpMethod.POST, "/users/register").permitAll()
                    .anyRequest().authenticated()
            )
            .csrf(csrf -> {
                if(!csrfEnabled) csrf.disable();
            })
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean  
    JwtEncoder jwtEncoder() {  
        // Cria uma chave JWK (JSON Web Key) a partir da chave pública e privada RSA  
        var jwk = new RSAKey.Builder(pubKey)  
                        .privateKey(privKey)  // Define a chave privada  
                        .build();             // Constrói o objeto JWK  

        // Cria um conjunto imutável de JWK contendo a chave criada  
        var jwks = new ImmutableJWKSet<>(new JWKSet(jwk));  

        // Retorna um codificador JWT utilizando o conjunto de chaves  
        return new NimbusJwtEncoder(jwks);  
    }  

    @Bean  
    JwtDecoder jwtDecoder() {  
        // Retorna um decodificador JWT utilizando a chave pública RSA  
        return NimbusJwtDecoder.withPublicKey(pubKey).build();  
    }  

    @Bean
    BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

}

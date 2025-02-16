package com.tiduswr.movies_server.config;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.tiduswr.movies_server.entities.Role;
import com.tiduswr.movies_server.entities.User;
import com.tiduswr.movies_server.repository.RoleRepository;
import com.tiduswr.movies_server.repository.UserRepository;

import jakarta.transaction.Transactional;

// @Configuration
public class AdminConfig implements CommandLineRunner{
    
    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private BCryptPasswordEncoder encoder;

    public AdminConfig(RoleRepository roleRepository, UserRepository userRepository, BCryptPasswordEncoder encoder){
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("\u001B[31m!!! CUIDADO !!!\u001B[0m Script de teste de criação do usuário sendo executado!");

        var roleAdmin = roleRepository.findByName(Role.Values.ADMIN.name());
        var userOpt = userRepository.findByUsername("admin");

        userOpt.ifPresentOrElse(
            user -> {
                System.out.println("O usuário ADMIN teste já existe!");
            },
            () -> {
                var user = User.builder()
                    .name("JOTARO KUJO")
                    .username("admin")
                    .password(encoder.encode("123teste"))
                    .roles(Set.of(roleAdmin.get()))
                    .build();
                
                userRepository.save(user);
            });

    }
    
}

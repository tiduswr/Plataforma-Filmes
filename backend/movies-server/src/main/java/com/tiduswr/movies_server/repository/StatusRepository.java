package com.tiduswr.movies_server.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tiduswr.movies_server.models.Status;

public interface StatusRepository extends JpaRepository<Status, Long>{
    
    Optional<Status> findByName(String name);

}

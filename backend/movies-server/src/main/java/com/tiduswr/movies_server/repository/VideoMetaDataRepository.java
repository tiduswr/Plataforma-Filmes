package com.tiduswr.movies_server.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiduswr.movies_server.models.VideoMetadata;

@Repository
public interface VideoMetaDataRepository extends JpaRepository<VideoMetadata, UUID>{
    
}

package com.tiduswr.movies_server.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tiduswr.movies_server.models.VideoMetadata;

@Repository
public interface VideoMetaDataRepository extends JpaRepository<VideoMetadata, UUID>{

    @Query("SELECT v FROM VideoMetadata v WHERE LOWER(v.title) LIKE LOWER(CONCAT('%', :filter, '%')) AND v.status.name = 'OK' AND v.visible = true")
    Page<VideoMetadata> searchVideosByTitle(@Param("filter") String filter, Pageable pageable);
    
}

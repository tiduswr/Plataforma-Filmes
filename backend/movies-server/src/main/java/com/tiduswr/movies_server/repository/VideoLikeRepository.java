package com.tiduswr.movies_server.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tiduswr.movies_server.models.VideoLike;
import com.tiduswr.movies_server.models.id.VideoLikeId;

@Repository
public interface VideoLikeRepository extends JpaRepository<VideoLike, VideoLikeId> {

    @Query("SELECT COUNT(v) > 0 FROM VideoLike v WHERE v.video.videoId = :videoId AND v.user.userId = :userId")
    boolean isVideoLikedByUser(@Param("videoId") UUID videoId, @Param("userId") UUID userId);
    
}

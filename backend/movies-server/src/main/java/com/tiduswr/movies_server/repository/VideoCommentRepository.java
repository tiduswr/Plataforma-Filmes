package com.tiduswr.movies_server.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tiduswr.movies_server.models.Comment;
import com.tiduswr.movies_server.models.VideoMetadata;

@Repository
public interface VideoCommentRepository extends JpaRepository<Comment, UUID> {
    Page<Comment> findByVideo(VideoMetadata video, Pageable pageable);
}

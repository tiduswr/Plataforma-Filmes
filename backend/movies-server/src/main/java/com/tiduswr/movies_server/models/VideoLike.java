package com.tiduswr.movies_server.models;

import com.tiduswr.movies_server.models.id.VideoLikeId;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_video_likes")
@Getter @Setter @AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder @NoArgsConstructor
public class VideoLike {
    
    @EmbeddedId
    @EqualsAndHashCode.Include
    private VideoLikeId video_like_id;

    @ManyToOne
    @MapsId("videoId")
    @JoinColumn(name = "video_id")
    private VideoMetadata video;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

}

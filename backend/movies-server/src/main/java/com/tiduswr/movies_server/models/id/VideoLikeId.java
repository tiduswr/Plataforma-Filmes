package com.tiduswr.movies_server.models.id;

import java.io.Serializable;
import java.util.UUID;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter @Setter @AllArgsConstructor
@EqualsAndHashCode
public class VideoLikeId implements Serializable{
    
    private UUID videoId;
    private UUID userId;

}

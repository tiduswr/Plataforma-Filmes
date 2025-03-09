package com.tiduswr.movies_server.models.dto;

import java.util.UUID;

import com.tiduswr.movies_server.models.Comment;

public record CommentResponse(

    UUID comment_id,
    String content,
    CommentOwnerResponse user,
    UUID video_id

) {

    public static CommentResponse from(Comment comment, boolean hasImage){
        return new CommentResponse(comment.getCommentId(), comment.getContent(), CommentOwnerResponse.from(comment.getUser(), hasImage), comment.getVideo().getVideoId());
    }

}

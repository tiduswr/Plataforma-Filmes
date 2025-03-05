package com.tiduswr.movies_server.models.dto;

import java.util.UUID;

import com.tiduswr.movies_server.models.Comment;

public record CommentResponse(

    UUID comment_id,
    String content,
    VideoOwnerResponse user,
    UUID video_id

) {

    public static CommentResponse from(Comment comment){
        return new CommentResponse(comment.getCommentId(), comment.getContent(), VideoOwnerResponse.from(comment.getUser()), comment.getVideo().getVideoId());
    }

}

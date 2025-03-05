package com.tiduswr.movies_server.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tiduswr.movies_server.models.ImageType;
import com.tiduswr.movies_server.models.dto.CommentRequest;
import com.tiduswr.movies_server.models.dto.CommentResponse;
import com.tiduswr.movies_server.models.dto.PageResponse;
import com.tiduswr.movies_server.models.dto.VideoMetadataResponse;
import com.tiduswr.movies_server.models.dto.VideoUpdateRequest;
import com.tiduswr.movies_server.models.dto.VideoUpdateResponse;
import com.tiduswr.movies_server.models.dto.VideoUploadRequest;
import com.tiduswr.movies_server.service.VideoService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/videos")
@AllArgsConstructor
public class VideosController {
    
    private VideoService videoService;

    @PostMapping
    public ResponseEntity<Void> uploadVideo(
            @RequestPart("file") MultipartFile file,
            @RequestPart("data") @Valid VideoUploadRequest videoData,
            @AuthenticationPrincipal Jwt jwt) {
        
        var userId = jwt.getSubject();
        videoService.validateVideoAndEnqueueTask(file, videoData, userId);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{videoId}")
    public ResponseEntity<VideoUpdateResponse> updateVideoMetadata(
        @RequestBody @Valid VideoUpdateRequest request, 
        @PathVariable("videoId") String videoId,
        @AuthenticationPrincipal Jwt jwt) {
        
        var userId = jwt.getSubject();
        var updated = videoService.updateVideoMetadata(request, videoId, userId);

        return ResponseEntity.ok().body(updated);
    }

    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> deleteVideo(
            @PathVariable("videoId") String videoId,
            @AuthenticationPrincipal Jwt jwt) {
        
        var userId = jwt.getSubject();
        videoService.deleteVideo(videoId, userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{videoId}/thumbnail/{type}")
    public ResponseEntity<byte[]> getImage(@PathVariable("videoId") String videoId, @PathVariable("type") ImageType type) {
        byte[] imageBytes = videoService.getThumbnail(videoId, type);
        
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(imageBytes);
    }

    @PostMapping("/{videoId}/comment")
    public ResponseEntity<CommentResponse> postComment(
        @PathVariable("videoId") String videoId, 
        @RequestBody @Valid CommentRequest request,
        @AuthenticationPrincipal Jwt jwt){
        
        CommentResponse response = videoService.commentOnVideo(videoId, request, jwt.getSubject());

        return ResponseEntity.ok().body(response);
    }
    
    @GetMapping("/{videoId}/comments")
    public ResponseEntity<PageResponse<CommentResponse>> getComments(
        @PathVariable("videoId") String videoId,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "10") int size){
        
        var pageable = PageRequest.of(page, size);
        var response = videoService.getCommentsFrom(videoId, pageable);

        return ResponseEntity.ok().body(PageResponse.from(response));
    }

    @DeleteMapping("/{videoId}/comment/{comment_id}")
    public ResponseEntity<Void> deleteComment(
        @PathVariable("videoId") String videoId, 
        @PathVariable("comment_id") String commentId, 
        @AuthenticationPrincipal Jwt jwt){
        
        var userId = jwt.getSubject();
        videoService.deleteCommentFrom(commentId, videoId, userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<PageResponse<VideoMetadataResponse>> getVideos(
            @RequestParam(value = "filter", defaultValue = "") String filter,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        
        var pageable = PageRequest.of(page, size);
        Page<VideoMetadataResponse> response = videoService.getVideos(filter, pageable);

        return ResponseEntity.ok(PageResponse.from(response));
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<VideoMetadataResponse> getVideo(@PathVariable("videoId") String videoId) {
        var response = videoService.getVideoById(UUID.fromString(videoId));

        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/{videoId}/like")
    public ResponseEntity<Void> toggleLike(@PathVariable("videoId") String videoId, @AuthenticationPrincipal Jwt jwt) {
        var userId = jwt.getSubject();
        videoService.toggleLike(UUID.fromString(videoId), UUID.fromString(userId));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{videoId}/{playlist}.m3u8")
    public ResponseEntity<byte[]> getHlsPlaylist(@PathVariable("videoId") String videoId, @PathVariable("playlist") String playlist){
        var playlistBytes = videoService.getHLSPlaylist(videoId, playlist);

        return ResponseEntity.ok()
            .contentType(MediaType.valueOf("application/vnd.apple.mpegurl"))
            .body(playlistBytes);
    }

    @GetMapping("/{videoId}/{segment}.ts")
    public ResponseEntity<byte[]> getHlsSegment(@PathVariable("videoId") String videoId, @PathVariable("segment") String segment){
        byte[] segmentBytes = videoService.getHLSSegment(videoId, segment);
    
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("video/MP2T"))
                .body(segmentBytes);
    }

}

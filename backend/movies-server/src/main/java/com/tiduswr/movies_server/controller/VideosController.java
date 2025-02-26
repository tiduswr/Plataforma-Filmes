package com.tiduswr.movies_server.controller;

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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tiduswr.movies_server.models.ImageType;
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

    @GetMapping("/thumbnail/{videoId}/{type}")
    public ResponseEntity<byte[]> getImage(@PathVariable("videoId") String videoId, @PathVariable("type") ImageType type) {
        byte[] imageBytes = videoService.getThumbnail(videoId, type);
        
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(imageBytes);
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

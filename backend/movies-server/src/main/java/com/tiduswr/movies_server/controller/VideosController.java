package com.tiduswr.movies_server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tiduswr.movies_server.models.dto.VideoUploadRequest;
import com.tiduswr.movies_server.service.VideoService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/videos")
@AllArgsConstructor
public class VideosController {
    
    private VideoService videoService;

    @PutMapping
    public ResponseEntity<Void> uploadVideo(
            @RequestPart("file") MultipartFile file,
            @RequestPart("data") VideoUploadRequest videoData,
            @AuthenticationPrincipal Jwt jwt) {
        
        var userId = jwt.getSubject();
        videoService.validateVideoAndEnqueueTask(file, videoData, userId);

        return ResponseEntity.ok().build();
    }

}

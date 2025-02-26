package com.tiduswr.movies_server.service;

import java.util.UUID;

import org.springframework.amqp.AmqpException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tiduswr.movies_server.config.minio.MinioBuckets;
import com.tiduswr.movies_server.config.rbmq.QueueType;
import com.tiduswr.movies_server.exceptions.ImageProcessingException;
import com.tiduswr.movies_server.exceptions.InternalServerError;
import com.tiduswr.movies_server.exceptions.JsonProcessingFailException;
import com.tiduswr.movies_server.exceptions.NotFoundException;
import com.tiduswr.movies_server.exceptions.VideoProcessingException;
import com.tiduswr.movies_server.models.Status;
import com.tiduswr.movies_server.models.VideoMetadata;
import com.tiduswr.movies_server.models.dto.VideoTask;
import com.tiduswr.movies_server.models.dto.VideoUploadRequest;
import com.tiduswr.movies_server.repository.StatusRepository;
import com.tiduswr.movies_server.repository.UserRepository;
import com.tiduswr.movies_server.repository.VideoMetaDataRepository;
import com.tiduswr.movies_server.util.Util;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class VideoService {
    
    private VideoMetaDataRepository videoMetaDataRepository;
    private StatusRepository statusRepository;
    private MinioService minioService;
    private UserRepository userRepository;
    private final TaskPublisherService taskPublisher;

    @Transactional
    public void validateVideoAndEnqueueTask(MultipartFile file, VideoUploadRequest request, String userId){

        try{
            var is = file.getInputStream();
            var validated = Util.checkVideo(is);

            if(!validated.valid())
                throw new VideoProcessingException("O arquivo enviado não é válido");

            var status = statusRepository.findByName(Status.Values.PROCESSING.name()).orElseThrow(
                () -> new InternalServerError("Status PROCESSING não encontrado!")
            );

            var user = userRepository.findById(UUID.fromString(userId)).orElseThrow(
                () -> new NotFoundException("O usuário não foi encontrado")
            );

            var video = VideoMetadata.builder()
                .owner(user)
                .title(request.title())
                .description(request.description())
                .status(status)
                .duration(validated.videoTime())
                .build();
            var videoSaved = videoMetaDataRepository.save(video);

            String bucketName = MinioBuckets.VIDEO_PROCESSING.getBucketName();
            var minioSavedFileName = minioService.uploadFile(file, videoSaved.getVideoId().toString(), bucketName);

            try {
                VideoTask pubObj = new VideoTask(videoSaved.getVideoId().toString(), minioSavedFileName);
                taskPublisher.sendToQueue(QueueType.VIDEO_QUEUE, pubObj);
                
            } catch (JsonProcessingFailException ex) {
                deleteMinioFile(minioSavedFileName, bucketName);
                throw ex;
            } catch (AmqpException ex) {
                deleteMinioFile(minioSavedFileName, bucketName);
                throw ex;
            } catch (Exception ex) {
                deleteMinioFile(minioSavedFileName, bucketName);
                throw new ImageProcessingException(ex.getMessage());
            }
        }catch(Exception error){
            throw new VideoProcessingException(error.getMessage());
        }

    }

    private void deleteMinioFile(String fileName, String bucketName){
        if (fileName != null) {
            minioService.deleteFile(fileName, bucketName);
        }
    }

}

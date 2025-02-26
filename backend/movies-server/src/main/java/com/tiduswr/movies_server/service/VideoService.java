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
import com.tiduswr.movies_server.exceptions.ResourceNotAllowedException;
import com.tiduswr.movies_server.exceptions.VideoNotReadyException;
import com.tiduswr.movies_server.exceptions.VideoProcessingException;
import com.tiduswr.movies_server.models.ImageType;
import com.tiduswr.movies_server.models.Status;
import com.tiduswr.movies_server.models.VideoMetadata;
import com.tiduswr.movies_server.models.dto.VideoTask;
import com.tiduswr.movies_server.models.dto.VideoUpdateRequest;
import com.tiduswr.movies_server.models.dto.VideoUpdateResponse;
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
                .visible(true)
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

    @Transactional
    public void deleteVideo(String videoId, String userId) {
        var video = videoMetaDataRepository.findById(UUID.fromString(videoId)).orElseThrow(
            () -> new NotFoundException("Vídeo não encontrado")
        );
    
        var user = userRepository.findById(UUID.fromString(userId)).orElseThrow(
            () -> new NotFoundException("Usuário não encontrado")
        );
    
        if (!video.getOwner().getUserId().equals(user.getUserId())) {
            throw new ResourceNotAllowedException("Você não tem permissão para excluir este vídeo");
        }
    
        String bucketName = MinioBuckets.VIDEOS.getBucketName();
        try {
            minioService.deleteFolder(videoId, bucketName);
        } catch (Exception ex) {
            throw new InternalServerError("Erro ao excluir arquivos do MinIO");
        }
    
        videoMetaDataRepository.delete(video);
    }

    private void checkVideo(String videoId){
        var video = videoMetaDataRepository.findById(UUID.fromString(videoId)).orElseThrow(
            () -> new NotFoundException("Video não encontrado!")
        );

        var statusOk = statusRepository.findByName("OK").orElseThrow(
            () -> new NotFoundException("Status 'OK' não encontrado!")
        );

        if(!video.getStatus().equals(statusOk))
            throw new VideoNotReadyException("O video ainda está sendo processado");
    }

    public byte[] getThumbnail(String videoId, ImageType type){

        checkVideo(videoId);

        var file = mountThumbnailFileName(videoId, type);
        var is = minioService.getFile(file, MinioBuckets.VIDEOS.getBucketName());

        try{
            return is.readAllBytes();
        }catch (Exception ex){
            throw new InternalServerError("Erro ao converter imagem no Servidor");
        }
    }

    public byte[] getHLSPlaylist(String videoId, String playlist) {

        checkVideo(videoId);

        String fileName = videoId + "/" + playlist + ".m3u8";
        var is = minioService.getFile(fileName, MinioBuckets.VIDEOS.getBucketName());
    
        try {
            return is.readAllBytes();
        } catch (Exception ex) {
            throw new InternalServerError("Erro ao acessar a playlist no Servidor");
        }
    }

    public byte[] getHLSSegment(String videoId, String segmentName) {

        checkVideo(videoId);

        String fileName = videoId + "/" + segmentName + ".ts";
        var is = minioService.getFile(fileName, MinioBuckets.VIDEOS.getBucketName());
    
        try {
            return is.readAllBytes();
        } catch (Exception ex) {
            throw new InternalServerError("Erro ao acessar o segmento de vídeo no Servidor");
        }
    }

    private String mountThumbnailFileName(String videoId, ImageType type){
        String typeConcat;
        switch (type) {
            case BIG:
                typeConcat = "_big";
                break;
            case SMALL:
                typeConcat = "_small";
                break;
            default:
                throw new ImageProcessingException("Tipo de imagem não reconhecido");
        }

        return videoId + "/" + "thumbnail" + typeConcat + ".png";
    }

    private void deleteMinioFile(String fileName, String bucketName){
        if (fileName != null) {
            minioService.deleteFile(fileName, bucketName);
        }
    }

    public VideoUpdateResponse updateVideoMetadata(VideoUpdateRequest request, String videoId, String userId) {
        
        var video = videoMetaDataRepository.findById(UUID.fromString(videoId)).orElseThrow(
            () -> new NotFoundException("Video não encontrado")
        );

        var user = userRepository.findById(UUID.fromString(userId)).orElseThrow(
            () -> new NotFoundException("Usuário não encontrado")
        );

        if(!user.getUserId().equals(video.getOwner().getUserId()))
            throw new ResourceNotAllowedException("Você não tem permissão de acesso para esse video");

        if(request.title() != null){
            video.setTitle(request.title());
        }

        if(request.description() != null){
            video.setDescription(request.description());
        }

        if(request.visible() != null){
            video.setVisible(request.visible());
        }

        return VideoUpdateResponse.from(videoMetaDataRepository.save(video));
    }

}

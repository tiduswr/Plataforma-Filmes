package com.tiduswr.movies_server.service;

import java.util.Set;
import java.util.UUID;

import org.springframework.amqp.AmqpException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tiduswr.movies_server.config.minio.MinioBuckets;
import com.tiduswr.movies_server.config.rbmq.QueueType;
import com.tiduswr.movies_server.entities.Role;
import com.tiduswr.movies_server.entities.User;
import com.tiduswr.movies_server.entities.dto.ImageTask;
import com.tiduswr.movies_server.entities.dto.RegisterRequest;
import com.tiduswr.movies_server.entities.dto.RegisterResponse;
import com.tiduswr.movies_server.exceptions.ConflictException;
import com.tiduswr.movies_server.exceptions.ImageProcessingException;
import com.tiduswr.movies_server.exceptions.InternalServerError;
import com.tiduswr.movies_server.exceptions.JsonProcessingFailException;
import com.tiduswr.movies_server.repository.RoleRepository;
import com.tiduswr.movies_server.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final RoleRepository roleRepository;
    private final TaskPublisherService taskPublisher;
    private final MinioService minioService;

    public RegisterResponse basicUserRegister(RegisterRequest request){

        var roleBasic = roleRepository.findByName(Role.Values.USER.name()).orElseThrow(
            () -> new InternalServerError("Role USER não encontrada!")
        );

        userRepository
            .findByUsername(request.username())
            .ifPresent(
                user -> {
                    throw new ConflictException("O usuário já existe!");
                }
            );

        var newUser = User.builder()
            .name(request.name())
            .username(request.username())
            .password(encoder.encode(request.password()))
            .roles(Set.of(roleBasic))
        .build();
        
        var savedUser = userRepository.save(newUser);

        return RegisterResponse.from(savedUser);
    }

    public void publishUserImageTask(String userId, MultipartFile file){

        var user = userRepository.findById(UUID.fromString(userId)).orElseThrow(
            () -> new ImageProcessingException("O usuário não pode ser nulo")
        );
        
        if (file == null || file.isEmpty()) 
            throw new ImageProcessingException("O arquivo de imagem não pode ser nulo ou vazio");

        String bucketName = MinioBuckets.USER_IMAGE_PROCESSING.getBucketName();
        String uniqueKey = bucketName + ":" + user.getUserId().toString();
        String fileName = null;
    
        try {
            fileName = minioService.uploadFile(file, uniqueKey, bucketName);
            ImageTask pubObj = new ImageTask(user.getUserId().toString(), fileName);

            taskPublisher.sendToQueue(QueueType.IMAGEM_QUEUE, pubObj);
            
        } catch (JsonProcessingFailException ex) {
            deleteMinioFile(fileName, bucketName);
            throw ex;
        } catch (AmqpException ex) {
            deleteMinioFile(fileName, bucketName);
            throw ex;
        } catch (Exception ex) {
            deleteMinioFile(fileName, bucketName);
            throw new ImageProcessingException(ex.getMessage());
        }
    }    

    private void deleteMinioFile(String fileName, String bucketName){
        if (fileName != null) {
            minioService.deleteFile(fileName, bucketName);
        }
    }

}

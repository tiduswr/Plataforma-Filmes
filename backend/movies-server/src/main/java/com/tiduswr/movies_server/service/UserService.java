package com.tiduswr.movies_server.service;

import java.util.Set;
import java.util.UUID;

import org.springframework.amqp.AmqpException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.tiduswr.movies_server.config.minio.MinioBuckets;
import com.tiduswr.movies_server.config.rbmq.QueueType;
import com.tiduswr.movies_server.exceptions.ConflictException;
import com.tiduswr.movies_server.exceptions.DuplicateDatabaseEntryException;
import com.tiduswr.movies_server.exceptions.ImageProcessingException;
import com.tiduswr.movies_server.exceptions.InternalServerError;
import com.tiduswr.movies_server.exceptions.JsonProcessingFailException;
import com.tiduswr.movies_server.exceptions.NotFoundException;
import com.tiduswr.movies_server.models.Role;
import com.tiduswr.movies_server.models.User;
import com.tiduswr.movies_server.models.UserImageType;
import com.tiduswr.movies_server.models.dto.ImageTask;
import com.tiduswr.movies_server.models.dto.RegisterRequest;
import com.tiduswr.movies_server.models.dto.UpdateRequest;
import com.tiduswr.movies_server.models.dto.UserResponse;
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

    @Transactional
    public UserResponse basicUserRegister(RegisterRequest request){

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

        return UserResponse.from(savedUser);
    }

    @Transactional
    public UserResponse basicUserUpdate(UpdateRequest request, String userId){
        
        var user = userRepository.findById(UUID.fromString(userId)).orElseThrow(
            () -> new NotFoundException("O usuário não foi encontrado")
        );
        
        if(request.username() != null){
            if(userRepository.existsByUsername(request.username())) {
                throw new DuplicateDatabaseEntryException("Este username já está em uso.");
            }
            user.setUsername(request.username());
        }

        if(request.name() != null)
            user.setName(request.name());

        if(request.password() != null)
            user.setPassword(encoder.encode(request.password()));

        var updatedUser = userRepository.save(user);

        return UserResponse.from(updatedUser);

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

    public byte[] readUserImage(String userId, UserImageType type){
        var user = userRepository.findById(UUID.fromString(userId)).orElseThrow(
            () -> new NotFoundException("Usuário não encontrado")
        );

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

        String filename = user.getUserId().toString() + typeConcat + ".png";
        var fileIs = minioService.getFile(filename, MinioBuckets.USER_IMAGE.getBucketName());
        
        try{
            return fileIs.readAllBytes();
        }catch (Exception ex){
            throw new InternalServerError("Erro ao converter imagem no Servidor");
        }
    }

    private void deleteMinioFile(String fileName, String bucketName){
        if (fileName != null) {
            minioService.deleteFile(fileName, bucketName);
        }
    }

}

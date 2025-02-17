package com.tiduswr.movies_server.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tiduswr.movies_server.exceptions.UploadFailException;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MinioService {
    
    private final MinioClient minioClient;

    public String uploadFile(MultipartFile file, String fileName, String bucketName){

        String sanitizedFileName = sanitizeFileName(fileName);
        String sanitizedOriginalFilename = sanitizeFileName(file.getOriginalFilename());

        try(var is = file.getInputStream()){

            String originalFileName = sanitizedOriginalFilename;
            String extension = originalFileName != null && originalFileName.contains(".") ? 
                originalFileName.substring(originalFileName.lastIndexOf(".")) : "";

            if(extension == null || extension.isBlank())
                throw new IllegalArgumentException("O arquivo não possuí extensão");

            String fullFileName = sanitizedFileName + extension;

            boolean bucketExists = minioClient.bucketExists(
                BucketExistsArgs.builder()
                    .bucket(bucketName)
                    .build()
            );

            if(!bucketExists){
                minioClient.makeBucket(
                    MakeBucketArgs.builder()
                        .bucket(bucketName)
                        .build()
                );
            }

            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fullFileName)
                    .stream(is, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build()   
            );

            return fullFileName;

        }catch(Exception ex){
            throw new UploadFailException("O upload não pôde ser concluído", ex);
        }
        
    }

    public String sanitizeFileName(String fileName) {
        // Remove caracteres inválidos (exceto letras, números, hífens, underscores e pontos)
        String sanitized = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    
        // Impede que o nome termine com ponto ou espaço
        sanitized = sanitized.replaceAll("[.\\s]+$", "");
    
        // Garante que o nome não seja vazio
        if (sanitized.isEmpty()) {
            throw new IllegalArgumentException("Nome de arquivo inválido.");
        }
    
        return sanitized;
    }
    

}

package com.tiduswr.movies_server.service;

import java.io.InputStream;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tiduswr.movies_server.exceptions.MinioFailException;

import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.ListObjectsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.Result;
import io.minio.StatObjectArgs;
import io.minio.messages.Item;
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
            throw new MinioFailException("O upload não pôde ser concluído", ex);
        }
        
    }

    public InputStream getFile(String fileName, String bucketName){
        try{
            return minioClient.getObject(
                GetObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .build()
            );
        } catch (Exception ex) {
            throw new MinioFailException("Erro ao buscar arquivo", ex);
        }
    }

    public boolean exists(String fileName, String bucketName){
        try{
            return minioClient.statObject(
                StatObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .build()
            ) != null;
        } catch (Exception ex) {
            throw new MinioFailException("Erro ao buscar arquivo", ex);
        }
    }

    public void deleteFile(String fileName, String bucketName) {
        try {
            minioClient.removeObject(
                RemoveObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .build()
            );
        } catch (Exception ex) {
            throw new MinioFailException("Erro ao deletar o arquivo", ex);
        }
    }

    public void deleteFolder(String folderName, String bucketName) {
        try {
            var results = minioClient.listObjects(
                ListObjectsArgs.builder()
                    .bucket(bucketName)
                    .prefix(folderName + "/")
                    .recursive(true)
                    .build()
            );

            for (Result<Item> result : results) {
                String objectName = result.get().objectName();
                minioClient.removeObject(
                    RemoveObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .build()
                );
            }
        } catch (Exception ex) {
            throw new MinioFailException("Erro ao deletar a pasta e seus arquivos", ex);
        }
    }

    private String sanitizeFileName(String fileName) {
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

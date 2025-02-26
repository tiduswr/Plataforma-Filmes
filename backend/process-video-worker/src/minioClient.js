import dotenv from "dotenv";
import fs from 'fs';
import { Client } from "minio";
import path from 'path';

dotenv.config();

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const createBucketIfNotExists = async (bucketName) => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
    }
  } catch (error) {
    console.error(`Erro ao verificar/criar o bucket "${bucketName}":`, error);
  }
};

const deleteFromMinio = async (bucket, objectName) => {
  try {
    await minioClient.removeObject(bucket, objectName);
    console.log(`✅ Objeto ${objectName} deletado de ${bucket}`);
  } catch (err) {
    console.error(`❌ Erro ao deletar o objeto ${objectName}:`, err);
  }
};

const downloadFromMinio = async (bucket, objectName, filePath) => {
  return new Promise((resolve, reject) => {
    minioClient.fGetObject(bucket, objectName, filePath, (err) => {
      if (err) reject(err);
      else {
        console.log(`✅ ${objectName} baixado para ${filePath}`);
        resolve();
      }
    });
  });
};

const uploadHLS = async (folder, bucket, videoId) => {
  const files = fs.readdirSync(folder);

  for (const file of files) {
    const filePath = path.join(folder, file);
    const extname = path.extname(file).toLowerCase();

    if (extname === ".ts" || extname === ".m3u8") {
      const objectName = `${videoId}/${file}`;
      await uploadToMinio(bucket, objectName, filePath, false);
    }
  }
};

const uploadToMinio = async (bucket, objectName, filePath, logEnabled = true) => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const uploadedObjInfo = await minioClient.putObject(bucket, objectName, fileStream)
    if (logEnabled) {
      console.log(`✅ ${objectName} enviado para ${bucket}`);
    }
    return uploadedObjInfo;
  } catch (err) {
    if (logEnabled) {
      console.error(`❌ Erro ao enviar ${objectName}:`, err);
    }
    throw err;
  }
};

export { createBucketIfNotExists, minioClient as default, deleteFromMinio, downloadFromMinio, uploadHLS, uploadToMinio };


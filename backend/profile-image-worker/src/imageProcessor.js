import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import minioClient from './minioClient.js';

const TEMP_BUCKET =  process.env.MINIO_PROCESS_IMAGE_BUCKET;
const USER_BUCKET =  process.env.MINIO_USER_IMAGE_BUCKET;
const TEMP_FOLDER = '/tmp';

const exists = await minioClient.bucketExists(USER_BUCKET);
if (!exists) {
    await minioClient.makeBucket(USER_BUCKET);
}

const processImage = async (task) => {
    const { userId, fileName } = task;
    const tempFilePath = path.join(TEMP_FOLDER, fileName);
    const smallFilePath = path.join(TEMP_FOLDER, `${userId}_small.png`);
    const bigFilePath = path.join(TEMP_FOLDER, `${userId}_big.png`);

    try {
        if (!fs.existsSync(TEMP_FOLDER)) {
            fs.mkdirSync(TEMP_FOLDER, { recursive: true });
            console.log(`📂 Pasta temporária criada: ${TEMP_FOLDER}`);
        }

        const exists = await minioClient.bucketExists(USER_BUCKET);
        if (!exists) {
            await minioClient.makeBucket(USER_BUCKET);
            console.log(`📦 Bucket '${USER_BUCKET}' criado com sucesso.`);
        }

        console.log(`⬇️ Baixando imagem ${fileName} do bucket ${TEMP_BUCKET}`);
        const tempStream = await minioClient.getObject(TEMP_BUCKET, fileName);
        await streamToFile(tempStream, tempFilePath);
        console.log('✅ Imagem baixada com sucesso.');

        await sharp(tempFilePath)
            .resize(50, 50)
            .png()
            .toFile(smallFilePath);
        
        await sharp(tempFilePath)
            .png()
            .toFile(bigFilePath);

        console.log('🖼️ Imagens processadas com sucesso.');

        await uploadToMinio(USER_BUCKET, `${userId}_small.png`, smallFilePath);
        await uploadToMinio(USER_BUCKET, `${userId}_big.png`, bigFilePath);
        console.log('☁️ Imagens enviadas para o bucket de usuários.');

        await minioClient.removeObject(TEMP_BUCKET, fileName);
        console.log('🗑️ Imagem original removida do bucket temporário.');

    } catch (error) {
        console.error('❌ Erro ao processar a imagem:', error);
    } finally {
        removeFile(tempFilePath);
        removeFile(smallFilePath);
        removeFile(bigFilePath);
    }
};

const streamToFile = (stream, path) => {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(path);
        stream.pipe(fileStream)
            .on('finish', resolve)
            .on('error', reject);
    });
};

const uploadToMinio = async (bucket, objectName, filePath) => {
    const fileStream = fs.createReadStream(filePath);
    return minioClient.putObject(bucket, objectName, fileStream)
        .then(() => console.log(`✅ ${objectName} enviado com sucesso para ${bucket}`))
        .catch((err) => console.error(`❌ Erro ao enviar ${objectName}:`, err));
};

const removeFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Arquivo local removido: ${filePath}`);
    }
};

export default processImage;
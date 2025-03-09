import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import minioClient, { createBucketIfNotExists, deleteFromMinio, downloadFromMinio, uploadHLS, uploadToMinio } from './minioClient.js';
import { updateMovieStatus, updateProgress } from './videoRepository.js';

const TEMP_FOLDER = '/temp';
const VIDEO_BUCKET = process.env.MINIO_VIDEOS_BUCKET;
const TEMP_BUCKET = process.env.MINIO_PROCESS_VIDEO_BUCKET;
const VIDEOS_GET_ENDPOINT = process.env.VIDEOS_GET_ENDPOINT;

await createBucketIfNotExists(VIDEO_BUCKET);
await createBucketIfNotExists(TEMP_BUCKET);

const resolutions = [
    { name: '240p', size: '426x240', bitrate: '761200', codec: 'avc1.640015,mp4a.40.2' },
    { name: '480p', size: '854x480', bitrate: '1460800', codec: 'avc1.64001e,mp4a.40.2' },
    { name: '720p', size: '1280x720', bitrate: '3185600', codec: 'avc1.64001f,mp4a.40.2' },
    { name: '1080p', size: '1920x1080', bitrate: '5570400', codec: 'avc1.640028,mp4a.40.2' },
];

const processVideo = async (task) => {
    const { video_id, file_name } = task;
    const videoFolder = path.join(TEMP_FOLDER, video_id);

    try {
        const videoFilePath = path.join(videoFolder, file_name);
        if (!fs.existsSync(videoFolder)) {
            fs.mkdirSync(videoFolder, { recursive: true });
            console.log(`📂 Pasta criada: ${videoFolder}`);
        }

        console.log(`⬇️ Baixando ${video_id} do MinIO...`);
        await downloadFromMinio(TEMP_BUCKET, file_name, videoFilePath);

        const { width, height, validResolutions } = await getValidResolutions(videoFilePath);
        console.log(`🔍 Resolução original do vídeo: ${width}x${height}`);

        const endpoint = VIDEOS_GET_ENDPOINT ? `${VIDEOS_GET_ENDPOINT}/${video_id}/` : "";
        console.log(`🎥 Convertendo ${video_id} para HLS...`);
        await updateProgress(video_id, "Convertendo video para HLS...", 10);
        await processResolutions(videoFilePath, videoFolder, validResolutions, endpoint, video_id);

        await captureThumbnails(videoFilePath, videoFolder);

        console.log(`🎥 Gerando playlist master...`);
        await updateProgress(video_id, "Gerando playlist master...", 10);
        createMasterPlaylist(videoFolder, validResolutions, endpoint);

        console.log(`📤 Enviando vídeos HLS para MinIO...`);
        await updateProgress(video_id, "Enviando para o serviço de armazenamento...", 35);
        await uploadHLS(videoFolder, VIDEO_BUCKET, video_id);

        console.log(`🗑️ Deletando arquivo temporário do MinIO...`);
        await deleteFromMinio(TEMP_BUCKET, file_name);

        console.log(`🔄 Atualizando status no banco de dados...`);
        await updateProgress(video_id, "Concluido.", 5);
        await updateMovieStatus("OK", String(video_id));
    } catch (error) {
        console.error('❌ Erro ao processar o vídeo:', error);

        try {
            console.log(`🗑️ Deletando vídeos HLS do MinIO...`);
            await deleteFolder(VIDEO_BUCKET, video_id);
        } catch (cleanUpError) {
            console.error(`⚠️ Erro ao deletar vídeos HLS: ${cleanUpError.message}`);
        }

        try {
            console.log(`🔄 Atualizando status de erro no banco de dados...`);
            await updateMovieStatus("ERROR", String(video_id));
        } catch (statusUpdateError) {
            console.error(`⚠️ Erro ao atualizar status de erro no banco de dados: ${statusUpdateError.message}`);
        }

        if(fs.existsSync(videoFolder)){
            try{
                console.log(`📤 Enviando vídeos original de volta para o MinIO...`);
                const videoFilePath = path.join(videoFolder, file_name);
                await uploadToMinio(TEMP_BUCKET, file_name, videoFilePath, false);
            }catch(tryUploadVideoTempBucket){
                console.error(`⚠️ Erro ao enviar arquivo original para o bucket de processamento de videos: ${tryUploadVideoTempBucket.message}`);
            }
        }

        throw error;
    } finally {
        console.log('🗑️ Limpando arquivos temporários...');
        try {
            removeFolder(videoFolder);
        } catch (cleanupError) {
            console.error(`⚠️ Erro ao limpar arquivos temporários: ${cleanupError.message}`);
        }
    }
};

const createMasterPlaylist = (outputFolder, resolutions, endpoint = "") => {
    const masterPlaylistPath = path.join(outputFolder, 'master.m3u8');
    let masterContent = "#EXTM3U\n";
    masterContent += "#EXT-X-VERSION:6\n";

    resolutions.forEach(({ name, size, bitrate, codec }) => {
        masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(bitrate)},RESOLUTION=${size},CODECS="${codec}"\n`;
        masterContent += `${endpoint}${name}.m3u8\n\n`;
    });

    fs.writeFileSync(masterPlaylistPath, masterContent);
    console.log(`✅ Master playlist criada: ${masterPlaylistPath}`);
};

const getVideoResolution = (inputFile) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(inputFile, (err, metadata) => {
            if (err) reject(err);
            else {
                const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
                if (videoStream) {
                    resolve({ width: videoStream.width, height: videoStream.height });
                } else {
                    reject(new Error('Vídeo não encontrado.'));
                }
            }
        });
    });
};

const getValidResolutions = async (inputFile) => {
    const { width, height } = await getVideoResolution(inputFile);
    let validResolutions;

    if (width > 1920) {
        resolutions
    } else {
        validResolutions = resolutions.filter(res => {
            const resWidth = parseInt(res.size.split('x')[0]);
            return resWidth <= width;
        });
    }

    return {width, height, validResolutions};
}

async function convertToHLS(inputPath, outputDir, resolution, baseUrl = "") {
    return new Promise((resolve, reject) => {
        const { name, size, bitrate } = resolution;       

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        ffmpeg(inputPath)
            .outputOptions([
                `-vf scale=${size}`,
                '-c:v libx264',
                `-b:v ${bitrate}`,
                '-maxrate:v 1.2M',
                '-bufsize:v 2M',
                '-c:a aac',
                '-b:a 128k',
                '-ac 2',
                '-f hls',
                '-hls_time 1',
                '-hls_playlist_type vod',
                '-hls_flags independent_segments',
                `-hls_segment_filename ${path.join(outputDir, `${name}-%03d.ts`)}`,
                `-hls_base_url ${baseUrl}`
            ])
            .output(path.join(outputDir, `${name}.m3u8`))
            .on('end', () => {
                console.log(`Conversão para ${name} concluída.`);
                resolve();
            })
            .on('error', (err) => {
                console.error(`Erro na conversão ${name}: ${err.message}`);
                reject(err);
            })
            .run();
    });
}

async function processResolutions(inputPath, outputDir, resolutions, baseUrl, videoId) {
    const progressStep = 40 / resolutions.length;

    let count = 0;
    for (const resolution of resolutions) {
        const progressText = `Convertendo video para ${resolution.name}...`;
        count += progressStep;
        await updateProgress(videoId, progressText, progressStep);
        await convertToHLS(inputPath, outputDir, resolution, baseUrl);
    }

    if(count != 40){
        await updateProgress(videoId, progressText, 40);
    }
}

const deleteFolder = async (bucketName, folderName) => {
    try {
        const objectsStream = minioClient.listObjectsV2(bucketName, folderName, true);
        const objectsToDelete = [];

        for await (const obj of objectsStream) {
            objectsToDelete.push(obj.name);
        }

        if (objectsToDelete.length === 0) {
            console.log("Nenhum objeto encontrado na pasta.");
            return;
        }
        await minioClient.removeObjects(bucketName, objectsToDelete);
        console.log(`Todos os arquivos em '${folderName}' foram removidos.`);
    } catch (error) {
        console.error("Erro ao deletar pasta:", error);
    }
};

const captureThumbnails = (videoFilePath, outputFolder) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoFilePath, (err, metadata) => {
            if (err) return reject(err);

            const duration = metadata.format.duration;
            const midpoint = duration / 2;

            const resolutions = [
                { size: '1920x1080', filename: 'thumbnail_big.png' },
                { size: '854x480', filename: 'thumbnail_small.png' },
            ];

            let count = 0;
            resolutions.forEach(({ size, filename }) => {
                ffmpeg(videoFilePath)
                    .screenshots({
                        timestamps: [midpoint],
                        filename: filename,
                        folder: outputFolder,
                        size: size,
                    })
                    .on('end', () => {
                        count++;
                        if (count === resolutions.length) {
                            console.log(`✅ Capa gerada em ${outputFolder}`);
                            resolve(outputFolder);
                        }
                    })
                    .on('error', (err) => {
                        console.error(`Erro ao gerar a capa (${size}): ${err.message}`);
                        reject(err);
                    });
            });
        });
    });
};

const removeFolder = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`🗑️ Pasta removida: ${folderPath}`);
    }
};

export default processVideo;
import { PrismaClient } from "@prisma/client";
import { Buffer } from "buffer";

const prisma = new PrismaClient();

const stringIdToBufferHex = (videoId) => {
    return Buffer.from(videoId.replace(/-/g, ""), "hex");
}

const updateMovieStatus = async (statusName, videoId) => {
    return await prisma.$transaction(async (tx) => {
        const status = await tx.tb_status.findFirst({
            where: { name: statusName }
        });

        if (!status) {
            throw new Error(`Status não encontrado pelo atributo 'name(${statusName})' na tabela 'tb_status'.`);
        }

        const videoIdBuffer = stringIdToBufferHex(videoId);

        const movie = await tx.tb_videos.findFirst({
            where: { video_id: videoIdBuffer }
        });

        if (!movie) {
            throw new Error(`Movie não encontrado pelo atributo 'id(${videoId})' na tabela 'tb_videos'.`);
        }

        return await tx.tb_videos.update({
            where: { video_id: videoIdBuffer },
            data: { status_id: status.status_id }
        });
    });
}

const updateProgress = async (videoId, progressText, progressSumAmount) => {
    return await prisma.$transaction(async (tx) => {
        const videoIdBuffer = stringIdToBufferHex(videoId);

        const video = await tx.tb_videos.findFirst({
            where: {
                video_id: videoIdBuffer
            }
        });

        if (!video) {
            throw new Error("Vídeo não encontrado.");
        }

        const newAmount = video.progress_percentage + progressSumAmount;

        if(newAmount > 100){
            throw new Error("A porcentagem não pode ser maior que 100 ao ser salva na tb_videos");
        }

        return await tx.tb_videos.update({
            where: {
                video_id: videoIdBuffer
            },
            data: {
                progress_percentage: newAmount,
                progress_information: progressText
            }
        });
    })
}

export { updateMovieStatus, updateProgress };

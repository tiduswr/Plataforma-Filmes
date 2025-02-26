import { PrismaClient } from "@prisma/client";
import { Buffer } from "buffer";

const prisma = new PrismaClient();

const updateMovieStatus = async (statusName, videoId) => {
    return await prisma.$transaction(async (tx) => {
        const status = await tx.tb_status.findFirst({
            where: { name: statusName }
        });

        if (!status) {
            throw new Error(`Status não encontrado pelo atributo 'name(${statusName})' na tabela 'tb_status'.`);
        }

        const videoIdBuffer = Buffer.from(videoId.replace(/-/g, ""), "hex");

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

export { updateMovieStatus };

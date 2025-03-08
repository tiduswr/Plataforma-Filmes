import { z } from "zod";

const uploadSchema = z.object({
    video: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "O vídeo é obrigatório"),
    title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
    description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
    visible: z.boolean()
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}


export { uploadSchema };
export type { UploadFormData, UploadVideoModalProps };


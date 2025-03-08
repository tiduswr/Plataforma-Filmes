import { z } from "zod";

const editVideoSchema = z.object({
    title: z.string().min(5, "O título deve ter pelo menos 3 caracteres").max(100, "O título deve ter no máximo 100 caracteres"),
    description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
    visible: z.boolean()
});

type EditVideoFormData = z.infer<typeof editVideoSchema>;

interface EditVideoModalProps {
    video_id: string;
    isOpen: boolean;
    onClose: () => void;
}


export { editVideoSchema };
export type { EditVideoFormData, EditVideoModalProps };


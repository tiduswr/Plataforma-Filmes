import { errorDisplay, privateAxiosInstance } from "@/axios/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { EditVideoFormData, EditVideoModalProps, editVideoSchema } from "./types";

const fetchVideo = async (video_id: string) => {
    const response = await privateAxiosInstance.get(`/videos/${video_id}`);
    console.log(response)
    return response.data;
};

const EditVideoModal = ({ isOpen, onClose, video_id }: EditVideoModalProps) => {
    const { data: videoData, isLoading, error } = useQuery<EditVideoFormData>(
        { queryKey: ["video"], queryFn: () => fetchVideo(video_id), enabled: isOpen }
    );

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<EditVideoFormData>({
        resolver: zodResolver(editVideoSchema)
    });

    useEffect(() => {
        if (videoData) {
            setValue("description", videoData.description);
            setValue("title", videoData.title);
            setValue("visible", videoData.visible);
        }
    }, [setValue, videoData]);

    const mutation = useMutation({
        mutationFn: async (data: EditVideoFormData) => {
            const response = await privateAxiosInstance.put(`/videos/${video_id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Video editado!");
            reset();
            onClose();
        },
        onError: (error) => {
            console.log(error);
            errorDisplay(error, (msg) => toast.error(msg));
        }
    });

    const onSubmit = async (data: EditVideoFormData) => {
        mutation.mutate(data);
    };

    if (!isOpen || isLoading) return null;

    if (error instanceof Error) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Editar Vídeo</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4"> 
                    <input
                        type="text"
                        placeholder="Título"
                        {...register("title")}
                        className={`appearance-none border ${errors["title"] ? "border-red-600" : "border-gray-200"}
                            shadow w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded text-base
                            focus:outline-none focus:ring-2 ${errors["title"] ? "focus:ring-red-600" : "focus:ring-blue-800"}
                            focus:border-transparent`}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

                    <textarea
                        placeholder="Descrição"
                        {...register("description")}
                        className={`appearance-none border ${errors["description"] ? "border-red-600" : "border-gray-200"}
                            shadow w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded text-base
                            focus:outline-none focus:ring-2 ${errors["description"] ? "focus:ring-red-600" : "focus:ring-blue-800"}
                            focus:border-transparent h-20`}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

                    <div className="flex items-center gap-2">
                        <input type="checkbox" {...register("visible")} defaultChecked={videoData?.visible} />
                        <label className="text-gray-800">Visível para todos?</label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="bg-red-400 text-white px-4 py-2 rounded-lg cursor-pointer"
                        >
                            Fechar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVideoModal;
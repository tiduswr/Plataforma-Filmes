import { errorDisplay, privateAxiosInstance } from "@/axios/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileInputIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { CiFileOn } from "react-icons/ci";
import { toast } from "react-toastify";
import { UploadFormData, uploadSchema, UploadVideoModalProps } from "./types";

const UploadVideoModal = ({ isOpen, onClose }: UploadVideoModalProps) => {
    const { register, watch, handleSubmit, formState: { errors }, reset, setValue } = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema)
    });

    const watchedValue = watch();

    const onSubmit = async (data: UploadFormData) => {
        const formData = new FormData();
        
        const videoBlob = new Blob([data.video[0]], { type: data.video[0].type });
        formData.append("file", videoBlob, data.video[0].name);

        const dataBlob = new Blob([JSON.stringify({
            title: data.title,
            description: data.description,
            visible: data.visible,
        })], { type: "application/json" });
        formData.append("data", dataBlob);

        try{
            await privateAxiosInstance.post("/videos", 
                formData, { 
                    headers: { 
                        "Content-Type": "multipart/form-data"
                    } 
                }
            );
            toast.success("Video em processamento!")
            reset();
            onClose();
        }catch(error){
            errorDisplay(error, (msg) => toast.error(msg));
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            setValue("video", files);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Enviar Vídeo</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div
                        className="w-full py-9 bg-gray-50 rounded-2xl border border-gray-300 gap-3 grid border-dashed"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <CiFileOn size={50} color="blue" />
                            <h2 className="text-center text-gray-400 text-xs leading-4">MP4, AMV, MKV</h2>
                        </div>
                        <div className="grid gap-2">
                            <h4 className="text-center text-gray-900 text-sm font-medium leading-snug">
                                Arraste seu vídeo para aqui ou
                            </h4>
                            <div className="flex items-center justify-center">
                                <label>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        hidden
                                        {...register("video")}
                                    />
                                    <div className="flex w-28 h-9 px-2 flex-col bg-indigo-600 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                                        Escolher arquivo
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    {watchedValue.video?.item(0) && (
                        <div className="flex flex-row gap-2 items-center border text-green-900 border-green-900 rounded px-4 py-2 bg-green-50">
                            <FileInputIcon />
                            <p>
                                {watchedValue.video?.item(0)?.name}
                            </p>
                        </div>
                    )}
                    {errors.video && <p className="text-red-500 text-sm">{errors.video.message}</p>}

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
                        <input type="checkbox" {...register("visible")} />
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
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadVideoModal;

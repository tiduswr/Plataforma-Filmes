import { errorDisplay, privateAxiosInstance } from "@/axios/axios";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { ImagePickerProps } from "./types";

export default function ImagePicker({ classname, onUpdate }: ImagePickerProps) {
    const [image, setImage] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                setImage(reader.result as string);
                await sendImage(file);
                await onUpdate();
                toast.success("A imagem foi enfileirada para processamento, atualize a página em instantes!")
            };
            reader.readAsDataURL(file);
        }
    }

    const sendImage = async (file : File) => {
        const formData = new FormData();
        formData.append("file", file);

        try{
            await privateAxiosInstance.put("users/profile-image", 
                formData, { headers: { 
                    "Content-Type": "multipart/form-data"
                } }
            )
        }catch(error){
            errorDisplay(error, (msg) => toast.error(msg));
        }
    }

    const removeImage = () => setImage(null);

    return (
        <div className={`flex flex-col items-center space-y-4 ${classname}`}>
            {image ? (
                <div className="relative">
                    <img
                        src={image}
                        alt="Imagem de perfil"
                        className="w-48 h-48 object-cover rounded-full shadow-lg"
                    />
                    <button
                        onClick={removeImage}
                        className="absolute top-2 right-4 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-full shadow cursor-pointer hover:border-blue-500 transition">
                    <Upload size={32} className="text-gray-500" />
                    <span className="mt-2 text-sm text-gray-600">
                        Selecione uma imagem
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    );
}

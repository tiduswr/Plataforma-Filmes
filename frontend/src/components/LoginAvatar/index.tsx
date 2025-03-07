import { privateAxiosInstance } from "@/axios/axios";
import { LOGIN_MENU_LINKS } from "@/links";
import useAuthStore from "@/store/auth";
import useUserStore from "@/store/user";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginAvatar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [img, setImg] = useState<string>("/user.webp");
    const { user, deleteUserData } = useUserStore();
    const { removeAuthCredentials } = useAuthStore();
    const navigate = useNavigate();

    const getUserImage = useCallback(async () => {
        if(!user?.image_path)
            return;

        try{
            const path = `/users/profile-image/${user?.user_id}/small`;
            const response = await privateAxiosInstance.get(path, { responseType: "blob" });
            const imgUrl = URL.createObjectURL(response.data);
            setImg(imgUrl);
        }catch(error){
            console.error("O usuário ainda não possuí uma imagem de perfil.", error);
        }
    }, [user?.image_path, user?.user_id])

    const logout = () => {
        removeAuthCredentials();
        deleteUserData();
        navigate("/");
    }

    useEffect(() => {
        if(user?.user_id){
            getUserImage();
        }
    }, [getUserImage, user]);

    return (
        <div className="relative">
            <img
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-green-500 shadow"
                src={img}
                alt="User dropdown"
            />

            {isOpen && user && (
                <div className="absolute border shadow right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg w-44">
                    <div className="px-4 py-3 text-sm text-gray-900">
                        <p className="font-bold">{user.name}</p>
                        <div className="font-medium truncate">@{user.username}</div>
                    </div>
                    <ul className="py-2 text-sm text-gray-700">
                        {LOGIN_MENU_LINKS.map((link, index) => (
                            <li key={index} onClick={() => setIsOpen(false)}>
                                <Link to={link.url} className="block px-4 py-2 hover:bg-gray-200">{link.title}</Link>
                            </li>
                        ))}
                    </ul>
                    <div className="py-1">
                        <a href="#" onClick={logout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Sair</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginAvatar;

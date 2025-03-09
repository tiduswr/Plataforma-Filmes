import { privateAxiosInstance } from "@/axios/axios";
import LoadingDots from "@/components/LoadingDots";
import MoviePlayer from "@/components/MoviePlayer";
import { HOST } from "@/links";
import { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useParams } from "react-router-dom";
import NotFound from "../NotFound";

interface Owner {
    user_id: string;
    username: string;
    name: string;
    image_path: string[];
}

interface VideoData {
    video_id: string;
    title: string;
    description: string;
    duration: string;
    likeCount: number;
    views: number;
    owner: Owner;
    visible: boolean;
}

interface VideoLiked {
    liked: boolean;
}

const Movie = () => {
    const { video_id } = useParams();
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [ownerImage, setOwnerImage] = useState<string | null>(null);

    useEffect(() => {
        if (!video_id) return;
    
        const fetchVideoData = async () => {
            try {
                const response = await privateAxiosInstance.get<VideoData>(`${HOST}/videos/${video_id}`);
                setVideoData(response.data);
    
                const likeResponse = await privateAxiosInstance.get<VideoLiked>(`${HOST}/videos/${video_id}/like`);
                setIsLiked(likeResponse.data.liked);
    
                if (response.data.owner.image_path?.[0]) {
                    const imageResponse = await privateAxiosInstance.get(`${HOST}${response.data.owner.image_path[0]}`, {
                        responseType: "blob"
                    });
                    const imageUrl = URL.createObjectURL(imageResponse.data);
                    setOwnerImage(imageUrl);
                }
                await privateAxiosInstance.post(`${HOST}/videos/${video_id}/view`);
                
            } catch (err) {
                console.error("Erro ao buscar o vídeo:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
    
        fetchVideoData();
    }, [video_id]);

    const handleLike = async () => {
        if (!video_id) return;

        try {
            await privateAxiosInstance.post(`${HOST}/videos/${video_id}/like`);
            setIsLiked(!isLiked);
            setVideoData((prev) => prev ? { ...prev, likeCount: prev.likeCount + (isLiked ? -1 : 1) } : null);
        } catch (err) {
            console.error("Erro ao dar like:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center mt-22 lg:mx-20">
                <div className="bg-white p-10 rounded shadow ml-5 mt-22 mr-5 w-auto">
                    <LoadingDots />
                </div>
            </div>
        );
    }

    if (error || !videoData) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col items-center justify-center mt-22 lg:mx-20">
            <MoviePlayer video_id={videoData.video_id} />
            <div className="video-page-size-responsive w-full p-4 bg-white rounded-lg mt-2 shadow">                
                <div className="flex items-center justify-between mt-2">
                    <h1 className="font-bold text-2xl">{videoData.title}</h1>
                    <button 
                        onClick={handleLike} 
                        className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 cursor-pointer"
                    >
                        {isLiked ? <AiFillLike size={28} className="text-blue-600" /> : <AiOutlineLike size={28} />}
                        <span className="text-2xl">{videoData.likeCount}</span>
                    </button>
                </div>
                <div className="flex flex-row items-center gap-2 mt-4 mb-4">
                    {ownerImage ? (
                        <img
                            className="w-10 h-10 rounded-full cursor-pointer shadow-lg"
                            src={ownerImage}
                            alt="User profile"
                        />
                    ) : (
                        <img
                            className="w-10 h-10 rounded-full cursor-pointer shadow-lg"
                            src={"/user.webp"}
                            alt="User profile"
                        />
                    )}
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">{videoData.owner.name} (@{videoData.owner.username})</span>
                    </p>
                </div>
                <div className="flex items-center justify-between text-gray-600 text-sm mt-2">
                    <span>{videoData.views} visualizações • {videoData.duration}</span>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-gray-800 mt-3 text-sm">
                    <p>{videoData.description}</p>
                </div>
            </div>
        </div>
    );
};

export default Movie;
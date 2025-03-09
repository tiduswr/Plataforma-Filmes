import { privateAxiosInstance } from "@/axios/axios";
import { HOST } from "@/links";
import NotFound from "@/pages/NotFound";
import useAuthStore from "@/store/auth";
import Hls from "hls.js";
import Plyr from "plyr";
import { useEffect, useRef, useState } from "react";
import LoadingDots from "../LoadingDots";
import { HlsOptions, MoviePlayerProps } from "./types";

const MoviePlayer = ({ video_id } : MoviePlayerProps) => {
    const { token } = useAuthStore();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const plyrRef = useRef<Plyr | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean | null>(null);

    useEffect(() => {
        if (!video_id || !videoRef.current || !token) return;

        const video = videoRef.current;
        plyrRef.current?.destroy();
        setLoading(true);
        const hls = new Hls({
            xhrSetup: (xhr) => {
                xhr.setRequestHeader("Authorization", `Bearer ${token.token}`);
            }
        });

        const f = async () => {
            try{
                await privateAxiosInstance.get(`${HOST}/videos/${video_id}/master.m3u8`);
            }catch(e){
                console.log(e);
                setError(true);
                setLoading(false);
                return;
            }

            hls.loadSource(`${HOST}/videos/${video_id}/master.m3u8`);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                const availableQualities = hls.levels.map((l) => l.height);
                const defaultOptions: HlsOptions = {
                    controls: [
                        'play', 'progress', 'current-time', 'duration', 'mute', 'volume',
                        'settings', 'fullscreen'
                    ],
                    quality: {
                        default: availableQualities[0],
                        options: availableQualities,
                        forced: true,
                        onChange: (newQuality: number) => {
                            if (hls) {                            
                                const levelIndex = hls.levels.findIndex(l => l.height === newQuality);
                                if (levelIndex !== -1) {
                                    hls.currentLevel = levelIndex;
                                    if(plyrRef.current){
                                        //Limpa o buffer ao trocar a qualidade
                                        const ctime = plyrRef.current?.currentTime;
                                        plyrRef.current.currentTime = 0;
                                        plyrRef.current.currentTime = ctime;
                                    }
                                }
                            }
                        }
                    }
                };

                plyrRef.current = new Plyr(video, defaultOptions);
            });
            setLoading(false);
        }
        f();        

        return () => {
            hls.destroy();
            plyrRef.current?.destroy();
        };
    }, [video_id, token]);

    if(error){
        return (
            <NotFound />
        )
    }

    return (
        <>
            <div hidden={loading ? false : true} className="bg-white p-10 rounded shadow ml-5 mt-22 mr-5 w-auto">
                <LoadingDots />
            </div>
            <div hidden={loading ? true : false} className="video-container video-page-size-responsive" >
                <video  ref={videoRef} controls />
            </div>
        </>
    );
};

export default MoviePlayer;

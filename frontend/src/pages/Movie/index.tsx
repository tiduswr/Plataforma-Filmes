import MoviePlayer from "@/components/MoviePlayer";
import { useParams } from "react-router-dom";

const Movie = () => {
    const { video_id } = useParams();

    return (
        <div className="flex flex-col items-center justify-center mt-22 lg:mx-20">
            <MoviePlayer video_id={video_id || ""}/>
        </div>
    );
};

export default Movie;

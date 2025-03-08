import { errorDisplay, privateAxiosInstance } from "@/axios/axios";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { ModalMessage } from "@/components/ConfirmDeleteModal/type";
import EditVideoModal from "@/components/EditVideoModal";
import UploadVideoModal from "@/components/UploadVideoModal";
import UserMoviesTable from "@/components/UserMoviesTable";
import { useQuery } from "@tanstack/react-query";
import { CircleArrowLeft, CircleArrowRight, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserMoviesTablePageable } from "./types";

const fetchMovies = async (page: number, filter: string): Promise<UserMoviesTablePageable> => {
  const response = await privateAxiosInstance.get<UserMoviesTablePageable>(`/videos/my?page=${page}&filter=${filter}&size=8`);
  return response.data;
};

const MyMovies = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<ModalMessage>({message: "", video_id: ""});
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [modalVideoId, setmodalVideoId] = useState<string | null>(null);
  const [videoModalOpen, setvideoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (filter.length >= 3 || filter === "") {
        setDebouncedFilter(filter);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [filter]);

  const { data: movies, isLoading, error, refetch } = useQuery({
    queryKey: ["userMovies", page, debouncedFilter],
    queryFn: () => fetchMovies(page, debouncedFilter)
  });

  const onEditClick = async (videoId: string) => {
    const video = movies?.content.find((m) => m.video_id === videoId);
    if (video) {
      setvideoModalOpen(true);
      setmodalVideoId(video.video_id);
    }
  };

  const onDeleteClick = async (videoId: string) => {
    const video = movies?.content.find((m) => m.video_id === videoId);
    if (video) {
      setVideoToDelete({
        message: `Você tem certeza que quer excluir o vídeo '${video.title}'?`,
        video_id: videoId
      });
      setIsConfirmDeleteOpen(true);
    } else {
      toast.error("Vídeo não encontrado");
    }
  };

  const confirmDelete = async () => {
    if (videoToDelete) {
      try {
        await privateAxiosInstance.delete(`/videos/${videoToDelete.video_id}`);
        await refetch();
        toast.success("O vídeo foi excluído!");
      } catch (error) {
        errorDisplay(error, (msg) => toast.error(msg));
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-22 mx-5 lg:mx-22 mb-8">
      <div className="w-full flex flex-row items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Filtrar por título..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`appearance-none shadow lg:w-1/3 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 
            rounded text-base outline-none focus:ring-0 focus:border-gray-300`}
        />
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          <UploadIcon />
        </button>
      </div>

      {isLoading && <p>Carregando vídeos...</p>}
      {error && <p className="text-red-500">Erro ao carregar vídeos</p>}
      {movies && (
        <>
          <UserMoviesTable 
            movies={movies.content} 
            onEdit={onEditClick} 
            onDelete={onDeleteClick}
          />
          <div className="flex felx-row gap-4 justify-center items-center w-full mt-4">
            <button 
              disabled={movies.first} 
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))} 
              className="px-4 py-2 bg-blue-600 rounded disabled:bg-gray-700 disabled:opacity-50"
            >
              <CircleArrowLeft color="white"/>
            </button>
            <span>Página {movies.number + 1} de {movies.totalPages}</span>
            <button 
              disabled={movies.last} 
              onClick={() => setPage((prev) => prev + 1)} 
              className="px-4 py-2 bg-blue-600 rounded disabled:bg-gray-700 disabled:opacity-50"
            >
              <CircleArrowRight color="white"/>
            </button>
          </div>
        </>
      )}

      <UploadVideoModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          refetch();
        }} 
      />

      <ConfirmDeleteModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          refetch();
        }}
        onConfirm={confirmDelete}
        message={videoToDelete.message}
      />

      <EditVideoModal 
        isOpen={videoModalOpen}
        onClose={() => {
          setvideoModalOpen(false)
          refetch();
        }}
        video_id={modalVideoId || ""}
      />
    </div>
  );
};

export default MyMovies;

import { BiError } from "react-icons/bi";
import { CiEdit, CiTrash } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import { MdDone } from "react-icons/md";
import { Link } from "react-router-dom";
import { UserMoviesTableProps } from "./types";

const UserMoviesTable = ({ movies, onEdit, onDelete, className = "" }: UserMoviesTableProps) => {
  return (
    <div className={`${className} flex flex-row w-full max-md:overflow-x-auto`}>
      <div className="w-full rounded shadow">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-100 uppercase bg-black">
            <tr>
              <th hidden={true}>ID</th>
              <th className="px-6 py-3 text-center w-1/4 rounded-tl-lg">Título</th>
              <th className="px-6 py-3 text-center w-1/6">Duração</th>
              <th className="px-6 py-3 text-center w-1/6">Progresso</th>
              <th className="px-6 py-3 text-center w-1/6">Visualizações</th>
              <th className="px-6 py-3 text-center w-1/6">Status</th>
              <th className="px-6 py-3 text-center w-1/12">Editar</th>
              <th className="px-6 py-3 text-center w-1/12 rounded-tr-lg">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {movies.length > 0 ? movies.map(({ title, duration, progress_information, progress_percentage, views, status, video_id }, i) => (
              <tr className="bg-white rounded-b-lg border-t border-gray-200" key={video_id}>
                <td hidden={true}>{video_id}</td>
                <th className={`px-6 py-4 font-medium text-gray-900 whitespace-nowrap ${i + 1 === movies.length ? "rounded-bl-lg" : ""}`}>
                  <Link to={`/movies/${video_id}`} className="text-blue-600 underline">{title}</Link>
                </th>
                <td className="px-3 py-4 text-center">{duration}</td>
                <td className="px-3 py-4 text-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progress_percentage}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{progress_information}</p>               
                </td>
                <td className="px-3 py-4 text-center">{views}</td>
                <td className="px-3 py-4">
                  <div className="w-full flex flex-col items-center">
                    {(
                      status === "OK" ? <MdDone size={22} color="green"/> : status === "PROCESSING" ? <GoClock size={22} color="orange"/> : <BiError size={22} color="red"/>
                    )}
                  </div>
                </td>
                <td className="px-3 py-4">
                  <div className="w-full flex flex-col items-center">
                    <button type="button" className="cursor-pointer" onClick={() => onEdit(video_id)}>
                      <CiEdit size={22} color="green" />
                    </button>
                  </div>
                </td>
                <td className={`px-3 py-4 ${i + 1 === movies.length ? "rounded-br-lg" : ""}`}>
                  <div className="w-full flex flex-col items-center">
                    <button type="button" className="cursor-pointer" onClick={() => onDelete(video_id)}>
                      <CiTrash size={22} color="red" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr className="bg-white rounded-b-lg border-t border-gray-200" key={0}>
                <td className="px-3 py-4" colSpan={7}>
                  <div className="text-center">
                    Nenhum resultado encontrado!
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserMoviesTable;
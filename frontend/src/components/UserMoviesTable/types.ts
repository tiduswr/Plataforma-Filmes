import { UserMoviesTableType } from "@/pages/MyMovies/types";

type UserMoviesTableProps = {
    movies : UserMoviesTableType[];
    onEdit: (videoId : string) => Promise<void>;
    onDelete: (videoId : string) => Promise<void>;
    className?: string;
}

export type { UserMoviesTableProps, UserMoviesTableType };


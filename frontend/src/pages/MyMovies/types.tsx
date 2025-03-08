type UserMoviesTableType = {
    title: string; 
    duration: string; 
    description: string; 
    progress_information: string;
    progress_percentage: number;
    views: number; 
    video_id: string;
    status: string;
    visible: boolean
}

type UserMoviesTablePageable = {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
    content: UserMoviesTableType[];
}

export type { UserMoviesTablePageable, UserMoviesTableType };


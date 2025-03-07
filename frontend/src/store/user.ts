import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    image_path?: string[];
    user_id : string;
    username : string;
    name : string;
}

type UserData = {
    user: User | null;
    setUserData: (user : User) => void;
    deleteUserData: () => void;
}

const useUserStore = create<UserData>()(
    persist<UserData>(
        (set) => ({
            user: null,
            setUserData: (data : User) : void => {
                set({ user : data })
            },
            deleteUserData: () : void => {
                set({ user : null })
            }
        }),
        {
            name: 'user-storage'
        }
    )
)

export default useUserStore;
export type { User, UserData };


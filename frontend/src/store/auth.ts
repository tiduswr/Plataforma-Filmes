import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Token = {
    token: string;
    expiresIn: number;
};

type Auth = {
    token: Token | null;
    logged: boolean;
    expirationDate: Date | null;
    login: (auth: Token) => void;
    logout: () => void;
    isTokenExpired: () => boolean;
};

const useAuthStore = create<Auth>()(
    persist(
        (set, get) => ({
            token: null,
            logged: false,
            expirationDate: null,

            login: (auth) => {
                const expirationDate = new Date();
                expirationDate.setSeconds(expirationDate.getSeconds() + auth.expiresIn);
                set({ token: { ...auth  }, logged: true, expirationDate });
            },

            logout: () => set({ token: null, logged: false }),

            isTokenExpired: () : boolean => {
                const { expirationDate } = get();
                if (expirationDate) {
                    return new Date() > expirationDate;
                }
                return true;
            }
        }),
        {
            name: 'auth-storage'
        }
    )
);

export default useAuthStore;
export type { Auth };

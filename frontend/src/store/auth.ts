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
    setAuthCredentials: (auth: Token) => void;
    removeAuthCredentials: () => void;
    isTokenExpired: () => boolean;
};

const useAuthStore = create<Auth>()(
    persist<Auth>(
        (set, get) => ({
            token: null,
            logged: false,
            expirationDate: null,

            setAuthCredentials: (auth) => {
                const expirationDate = new Date();
                expirationDate.setSeconds(expirationDate.getSeconds() + auth.expiresIn);
                set({ token: { ...auth  }, logged: true, expirationDate });
            },

            removeAuthCredentials: () => set({ token: null, logged: false }),

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

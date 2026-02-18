import { create } from "zustand";
import type { AuthState } from "./auth.type";

export const useAuthStore = create<AuthState>((set) => ({
    token:
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null,

    login: (token) => {
        localStorage.setItem("token", token);
        set({ token });
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ token: null });
    },
}));

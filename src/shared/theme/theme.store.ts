import { create } from "zustand";

const STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

function getInitialTheme(): Theme {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return "light";
}

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: getInitialTheme(),

    setTheme: (theme) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, theme);
        }
        set({ theme });
    },

    toggleTheme: () =>
        set((state) => {
            const next: Theme = state.theme === "light" ? "dark" : "light";
            if (typeof window !== "undefined") {
                localStorage.setItem(STORAGE_KEY, next);
            }
            return { theme: next };
        }),
}));

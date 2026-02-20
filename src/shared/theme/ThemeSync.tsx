import { useEffect } from "react";
import { useThemeStore } from "./theme.store";

/**
 * Syncs theme from store to document.documentElement for Tailwind dark mode (class strategy).
 * Add/remove "dark" class so dark: variants apply app-wide.
 */
export function ThemeSync() {
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme]);

    return null;
}

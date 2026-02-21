import { Link } from "react-router-dom";
import { useAuthStore } from "@/feature/auth/auth.store";
import { useThemeStore } from "@/shared/theme/theme.store";

export const Header = () => {
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center dark:bg-gray-800 dark:text-gray-300">
            <Link to="/dashboard" className="font-bold hover:opacity-90">
                Task Manager
            </Link>

            {token && (
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded px-3 py-1.5 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    >
                        {theme === "light" ? "Dark" : "Light"}
                    </button>
                    <button
                        onClick={logout}
                        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
};

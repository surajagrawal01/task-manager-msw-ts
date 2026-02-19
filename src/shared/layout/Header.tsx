import { Link } from "react-router-dom";
import { useAuthStore } from "@/feature/auth/auth.store";

export const Header = () => {
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between">
            <Link to="/dashboard" className="font-bold">
                Task Manager
            </Link>

            {token && (
                <button
                    onClick={logout}
                    className="bg-red-500 px-3 py-1 rounded"
                >
                    Logout
                </button>
            )}
        </header>
    );
};

import { Link } from "react-router-dom";
import { useAuthStore } from "./auth.store";

export const NotFoundPage = () => {
    const token = useAuthStore((state) => state.token);

    const redirectPath = token ? "/dashboard" : "/login";
    const buttonLabel = token ? "Go to Dashboard" : "Go to Login";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                404
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
                Page not found
            </p>

            <Link
                to={redirectPath}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
            >
                {buttonLabel}
            </Link>
        </div>
    );
};
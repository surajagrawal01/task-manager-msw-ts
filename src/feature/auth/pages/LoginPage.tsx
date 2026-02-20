import { useState } from "react";
import { useAuthStore } from "../auth.store";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        if (!response.ok) {
            alert("Invalid credentials");
            return;
        }

        const data = await response.json();
        login(data.token);
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 dark:bg-gray-800 dark:shadow-none">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
                    Login to Task Manager
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
                            Username
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4 dark:text-gray-400">
                    Use: <span className="font-medium">test / test123</span>
                </p>
            </div>
        </div>
    );
};

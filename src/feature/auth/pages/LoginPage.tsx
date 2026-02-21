import { useState } from "react";
import { useAuthStore } from "../auth.store";
import { useNavigate } from "react-router-dom";

type FormErrors = {
    username?: string;
    password?: string;
    general?: string;
};

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    // Clear specific field error + general error
    const clearError = (field: keyof FormErrors) => {
        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
            general: undefined,
        }));
    };

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        try {
            setIsLoading(true);

            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                setErrors({ general: "Invalid credentials" });
                return;
            }

            const data = await response.json();
            login(data.token);
            navigate("/dashboard");
        } catch {
            setErrors({ general: "Something went wrong. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 dark:bg-gray-800 dark:shadow-none">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
                    Login to Task Manager
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
                            Username
                        </label>
                        <input
                            className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${errors.username
                                ? "border-red-500 focus:ring-red-400"
                                : "border-gray-300 focus:ring-blue-500"
                                } dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100`}
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                clearError("username");
                            }}
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
                            Password
                        </label>
                        <input
                            type="password"
                            className={`w-full border rounded-md px-3 py-2 focus:ring-2 ${errors.password
                                ? "border-red-500 focus:ring-red-400"
                                : "border-gray-300 focus:ring-blue-500"
                                } dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100`}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                clearError("password");
                            }}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* General Error */}
                {errors.general && (
                    <p className="text-sm text-red-500 text-center mt-2">
                        {errors.general}
                    </p>
                )}

                <p className="text-xs text-gray-500 text-center mt-4 dark:text-gray-400">
                    Use: <span className="font-medium">test / test123</span>
                </p>
            </div>
        </div>
    );
};
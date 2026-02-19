import { useState } from "react";
import { useAuthStore } from "../auth.store";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // For now directly login (MSW will be added later)
        login("fake-jwt-token");

        navigate("/dashboard");
    };

    return (
        <div>
            <h1>Login </h1>

            < form onSubmit={handleSubmit} >
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                < input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                < button type="submit" > Login </button>
            </form>
        </div>
    );
};

import { useAuthStore } from "@/feature/auth/auth.store";

export const DashboardPage = () => {
    const logout = useAuthStore((state) => state.logout);

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

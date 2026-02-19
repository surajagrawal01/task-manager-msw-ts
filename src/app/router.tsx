import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "@/feature/auth/pages/LoginPage";
import { DashboardPage } from "@/feature/tasks/page/DashboardPage";
// import { ProtectedRoute } from "@/feature/auth/ProtectedRoute";
import { MainLayout } from "@/shared/layout/MainLayout";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/dashboard",
        element: (
            // <ProtectedRoute>
            <MainLayout>
                <DashboardPage />
            </MainLayout>
            // </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <LoginPage />,
    },
]);

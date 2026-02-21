import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "@/feature/auth/pages/LoginPage";
import { ProtectedRoute } from "@/feature/auth/ProtectedRoute";
import { MainLayout } from "@/shared/layout/MainLayout";
import { DashboardPage } from "@/feature/tasks/page/DashboardPage";
import { NotFoundPage } from "@/feature/auth/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <MainLayout>
                    <DashboardPage />
                </MainLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);
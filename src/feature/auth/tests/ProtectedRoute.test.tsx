/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { useAuthStore } from "../auth.store";

describe("ProtectedRoute", () => {
    beforeEach(() => {
        useAuthStore.setState({ token: null });
    });

    it("renders children when token is present", () => {
        useAuthStore.setState({ token: "valid-token" });

        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <span>Protected content</span>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(
            screen.getByText(/protected content/i)
        ).toBeInTheDocument();
    });

    it("redirects to /login when token is absent", () => {
        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <span>Protected content</span>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={<span>Login page</span>}
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/login page/i)).toBeInTheDocument();
        expect(
            screen.queryByText(/protected content/i)
        ).not.toBeInTheDocument();
    });
});
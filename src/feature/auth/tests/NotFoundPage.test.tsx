/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotFoundPage } from "../NotFoundPage";
import { useAuthStore } from "../auth.store";

describe("NotFoundPage", () => {
    beforeEach(() => {
        useAuthStore.setState({ token: null });
    });

    it("renders 404 and page not found message", () => {
        render(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        );

        expect(screen.getByText("404")).toBeInTheDocument();
        expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });

    it("shows 'Go to Login' when user is not authenticated", () => {
        useAuthStore.setState({ token: null });

        render(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        );

        const link = screen.getByRole("link", { name: /go to login/i });

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/login");
    });

    it("shows 'Go to Dashboard' when user is authenticated", () => {
        useAuthStore.setState({ token: "valid-token" });

        render(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        );

        const link = screen.getByRole("link", { name: /go to dashboard/i });

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/dashboard");
    });
});
/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("LoginPage", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    const renderPage = () =>
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

    test("renders login heading", () => {
        renderPage();

        expect(
            screen.getByText(/login to task manager/i)
        ).toBeInTheDocument();
    });

    test("shows validation errors when fields are empty", async () => {
        renderPage();

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: /login/i }));

        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    test("clears username error when typing", async () => {
        renderPage();
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: /login/i }));

        const usernameInput = screen.getByPlaceholderText(/enter username/i);

        await user.type(usernameInput, "test");

        await waitFor(() => {
            expect(
                screen.queryByText(/username is required/i)
            ).not.toBeInTheDocument();
        });
    });

    test("logs in successfully and navigates to dashboard", async () => {
        renderPage();
        const user = userEvent.setup();

        await user.type(
            screen.getByPlaceholderText(/enter username/i),
            "test"
        );
        await user.type(
            screen.getByPlaceholderText(/enter password/i),
            "test123"
        );

        await user.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
    });

    test("shows general error on invalid credentials", async () => {
        renderPage();
        const user = userEvent.setup();

        await user.type(
            screen.getByPlaceholderText(/enter username/i),
            "wrong"
        );
        await user.type(
            screen.getByPlaceholderText(/enter password/i),
            "wrong"
        );

        await user.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(
                screen.getByText(/invalid credentials/i)
            ).toBeInTheDocument();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
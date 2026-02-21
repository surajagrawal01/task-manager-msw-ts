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

    test("renders login heading", () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        expect(
            screen.getByText(/login to task manager/i)
        ).toBeInTheDocument();
    });

    test("logs in successfully with correct credentials and navigates to dashboard", async () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText(/enter username/i), "test");
        await user.type(screen.getByPlaceholderText(/enter password/i), "test123");
        await user.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
    });

    test("shows alert on invalid credentials", async () => {
        const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => { });

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText(/enter username/i), "wrong");
        await user.type(screen.getByPlaceholderText(/enter password/i), "wrong");
        await user.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith("Invalid credentials");
        });

        alertSpy.mockRestore();
    });
});
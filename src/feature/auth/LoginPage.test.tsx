import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";

describe("LoginPage", () => {
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

    test("logs in successfully with correct credentials", async () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText(/enter username/i), "test");
        await user.type(screen.getByPlaceholderText(/enter password/i), "test123");

        await user.click(screen.getByRole("button", { name: /login/i }));

        // Wait for navigation logic (token should be stored)
        expect(await screen.findByText(/login to task manager/i)).toBeInTheDocument();
    });
});

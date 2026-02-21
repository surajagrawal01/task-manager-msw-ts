/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardPage } from "../page/DashboardPage";
import { useTasksStore } from "../tasks.store";
import type { Task } from "../tasks.type";

const mockTasks: Task[] = [
    {
        id: "1",
        title: "Alpha Task",
        description: "Desc A",
        status: "pending",
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Beta Task",
        description: "Desc B",
        status: "completed",
        createdAt: new Date().toISOString(),
    },
    {
        id: "3",
        title: "Alpha Beta",
        description: "Desc C",
        status: "in-progress",
        createdAt: new Date().toISOString(),
    },
];

describe("Dashboard interactions", () => {
    beforeEach(() => {
        useTasksStore.setState({
            tasks: [],
            error: null,
        });
    });

    it("calls fetchTasks on mount", async () => {
        const fetchTasks = jest.fn().mockResolvedValue(undefined);

        useTasksStore.setState({
            ...useTasksStore.getState(),
            fetchTasks,
        });

        render(<DashboardPage />);

        await waitFor(() => {
            expect(fetchTasks).toHaveBeenCalled();
        });
    });

    it("opens modal when Add Task button clicked", async () => {
        render(<DashboardPage />);

        const addBtns = screen.getAllByRole("button", { name: /add task/i });
        await userEvent.click(addBtns[0]);

        expect(screen.getByText(/create task/i)).toBeInTheDocument();
    });

    it("adds a new task", async () => {
        render(<DashboardPage />);

        const addBtns = screen.getAllByRole("button", { name: /add task/i });
        await userEvent.click(addBtns[0]);

        await userEvent.type(screen.getByPlaceholderText("Title"), "New Task");
        await userEvent.type(screen.getByPlaceholderText("Description"), "New Description");

        await userEvent.click(
            screen.getByRole("button", { name: /create/i })
        );

        await waitFor(() => {
            expect(screen.getByText(/new task/i)).toBeInTheDocument();
        });
    });

    it("filters tasks by search query", async () => {
        useTasksStore.setState({ tasks: mockTasks });

        render(<DashboardPage />);

        const searchInputs = screen.getAllByPlaceholderText(/search by title/i);
        await userEvent.type(searchInputs[0], "Alpha");

        expect(screen.getByText(/alpha task/i)).toBeInTheDocument();
        expect(screen.getByText(/alpha beta/i)).toBeInTheDocument();
        expect(screen.queryByText(/beta task/i)).not.toBeInTheDocument();
    });

    it("filters tasks by status", async () => {
        useTasksStore.setState({ tasks: mockTasks });

        render(<DashboardPage />);

        const statusSelects = screen.getAllByRole("combobox");
        await userEvent.selectOptions(statusSelects[0], "completed");

        expect(screen.getByText(/beta task/i)).toBeInTheDocument();
        expect(screen.queryByText(/alpha task/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/alpha beta/i)).not.toBeInTheDocument();
    });

    it("shows all tasks when search and filter are empty", () => {
        useTasksStore.setState({ tasks: mockTasks });

        render(<DashboardPage />);

        expect(screen.getByText(/alpha task/i)).toBeInTheDocument();
        expect(screen.getByText(/alpha beta/i)).toBeInTheDocument();
        expect(screen.getByText(/beta task/i)).toBeInTheDocument();
    });
});
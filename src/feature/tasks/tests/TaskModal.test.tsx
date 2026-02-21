/// <reference types="@testing-library/jest-dom" />
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskModal from "../components/TaskModal";
import { useTasksStore } from "../tasks.store";

describe("TaskModal", () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        mockOnClose.mockClear();
        useTasksStore.setState({
            ...useTasksStore.getState(),
            createTask: jest.fn().mockResolvedValue(undefined),
            updateTask: jest.fn().mockResolvedValue(undefined),
        });
    });

    describe("create mode", () => {
        it("shows Create Task heading and Create button", () => {
            render(<TaskModal mode="create" onClose={mockOnClose} />);

            expect(screen.getByText("Create Task")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
        });

        it("submit button is disabled when title and description are empty", () => {
            render(<TaskModal mode="create" onClose={mockOnClose} />);

            const submitBtn = screen.getByRole("button", { name: /create/i });
            expect(submitBtn).toBeDisabled();
        });

        it("submit button is enabled when title and description are filled", async () => {
            render(<TaskModal mode="create" onClose={mockOnClose} />);

            await userEvent.type(screen.getByPlaceholderText("Title"), "A");
            await userEvent.type(screen.getByPlaceholderText("Description"), "B");

            expect(screen.getByRole("button", { name: /create/i })).not.toBeDisabled();
        });

        it("shows validation errors when submitting empty form", async () => {
            render(<TaskModal mode="create" onClose={mockOnClose} />);

            const form = screen.getByPlaceholderText("Title").closest("form");

            await act(async () => {
                form?.requestSubmit();
            });

            expect(await screen.findByText("Title is required")).toBeInTheDocument();
            expect(await screen.findByText("Description is required")).toBeInTheDocument();
        });

        it("calls createTask and onClose when valid", async () => {
            const createTask = jest.fn().mockResolvedValue(undefined);
            useTasksStore.setState({
                ...useTasksStore.getState(),
                createTask,
            });

            render(<TaskModal mode="create" onClose={mockOnClose} />);

            await userEvent.type(screen.getByPlaceholderText("Title"), "New Title");
            await userEvent.type(screen.getByPlaceholderText("Description"), "New Desc");
            await userEvent.click(screen.getByRole("button", { name: /create/i }));

            expect(createTask).toHaveBeenCalledWith({
                title: "New Title",
                description: "New Desc",
                status: "pending",
            });

            expect(mockOnClose).toHaveBeenCalled();
        });

        it("calls onClose when Cancel is clicked", async () => {
            render(<TaskModal mode="create" onClose={mockOnClose} />);

            await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    describe("edit mode", () => {
        const existingTask = {
            id: "edit-1",
            title: "Existing Title",
            description: "Existing Desc",
            status: "in-progress" as const,
            createdAt: new Date().toISOString(),
        };

        it("shows Edit Task heading and Update button", () => {
            render(<TaskModal mode="edit" task={existingTask} onClose={mockOnClose} />);

            expect(screen.getByText("Edit Task")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
        });

        it("prefills form with task data", () => {
            render(<TaskModal mode="edit" task={existingTask} onClose={mockOnClose} />);

            expect(screen.getByDisplayValue("Existing Title")).toBeInTheDocument();
            expect(screen.getByDisplayValue("Existing Desc")).toBeInTheDocument();
        });

        it("calls updateTask and onClose when form is submitted", async () => {
            const updateTask = jest.fn().mockResolvedValue(undefined);
            useTasksStore.setState({
                ...useTasksStore.getState(),
                updateTask,
            });

            render(<TaskModal mode="edit" task={existingTask} onClose={mockOnClose} />);

            await userEvent.clear(screen.getByPlaceholderText("Title"));
            await userEvent.type(screen.getByPlaceholderText("Title"), "Updated Title");

            await userEvent.click(screen.getByRole("button", { name: /update/i }));

            expect(updateTask).toHaveBeenCalledWith("edit-1", {
                title: "Updated Title",
                description: "Existing Desc",
                status: "in-progress",
            });

            expect(mockOnClose).toHaveBeenCalled();
        });

        it("shows validation errors when clearing fields", async () => {
            render(<TaskModal mode="edit" task={existingTask} onClose={mockOnClose} />);

            await userEvent.clear(screen.getByPlaceholderText("Title"));
            await userEvent.clear(screen.getByPlaceholderText("Description"));

            const form = screen.getByPlaceholderText("Title").closest("form");

            await act(async () => {
                form?.requestSubmit();
            });

            expect(await screen.findByText("Title is required")).toBeInTheDocument();
            expect(await screen.findByText("Description is required")).toBeInTheDocument();
        });

        it("calls onClose when Cancel is clicked", async () => {
            render(<TaskModal mode="edit" task={existingTask} onClose={mockOnClose} />);

            await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});
/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskRow from "../components/TaskRow";
import { useTasksStore } from "../tasks.store";

jest.mock("@/shared/components/Tooltip", () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockTask = {
    id: "task-1",
    title: "My Task",
    description: "My description",
    status: "pending" as const,
    createdAt: new Date("2024-06-01T12:00:00Z").toISOString(),
};

const renderRow = (task = mockTask, onEdit = jest.fn()) =>
    render(
        <table>
            <tbody>
                <TaskRow task={task} onEdit={onEdit} />
            </tbody>
        </table>
    );

describe("TaskRow", () => {
    beforeEach(() => {
        useTasksStore.setState({
            tasks: [mockTask],
            updateTask: jest.fn().mockResolvedValue(undefined),
            deleteTask: jest.fn().mockResolvedValue(undefined),
        });
    });

    it("renders task title, description, and status", () => {
        renderRow();

        expect(screen.getByText(/my task/i)).toBeInTheDocument();
        expect(screen.getAllByText(/my description/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/pending/i)[0]).toBeInTheDocument();
    });

    it("renders formatted date", () => {
        renderRow();

        const expectedDate = new Date(mockTask.createdAt).toLocaleDateString();
        expect(screen.getAllByText(expectedDate)[0]).toBeInTheDocument();
    });

    it("calls updateTask with next status when cycle button clicked", async () => {
        const updateTask = jest.fn().mockResolvedValue(undefined);

        useTasksStore.setState({
            ...useTasksStore.getState(),
            updateTask,
        });

        renderRow();

        const row = screen.getByRole("row");
        const buttons = within(row).getAllByRole("button");

        await userEvent.click(buttons[0]);

        expect(updateTask).toHaveBeenCalledWith("task-1", {
            status: "in-progress",
        });
    });

    it("calls onEdit when edit button clicked", async () => {
        const onEdit = jest.fn();
        renderRow(mockTask, onEdit);

        const row = screen.getByRole("row");
        const buttons = within(row).getAllByRole("button");

        await userEvent.click(buttons[1]);

        expect(onEdit).toHaveBeenCalled();
    });

    it("calls deleteTask when delete button clicked", async () => {
        const deleteTask = jest.fn().mockResolvedValue(undefined);

        useTasksStore.setState({
            ...useTasksStore.getState(),
            deleteTask,
        });

        renderRow();

        const row = screen.getByRole("row");
        const buttons = within(row).getAllByRole("button");

        await userEvent.click(buttons[2]);

        expect(deleteTask).toHaveBeenCalledWith("task-1");
    });

    it("shows No description when task description is empty", () => {
        renderRow({ ...mockTask, description: "" });

        expect(screen.getAllByText(/no description/i)[0]).toBeInTheDocument();
    });
});
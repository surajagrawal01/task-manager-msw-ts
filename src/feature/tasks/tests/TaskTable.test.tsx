/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import TaskTable from "../components/TaskTable";
import { Task } from "../tasks.type";

const mockTasks: Task[] = [
    {
        id: "1",
        title: "Task 1",
        description: "Description 1",
        status: "pending",
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Task 2",
        description: "Description 2",
        status: "completed",
        createdAt: new Date("2024-01-15").toISOString(),
    },
];

describe("TaskTable", () => {
    it("renders tasks correctly", () => {
        render(<TaskTable tasks={mockTasks} />);


        expect(screen.getByText("Task 1")).toBeInTheDocument();
        expect(screen.getAllByText("Description 1")[0]).toBeInTheDocument();
        expect(screen.getAllByText("pending")[0]).toBeInTheDocument();
        expect(screen.getByText("Task 2")).toBeInTheDocument();
        expect(screen.getAllByText("Description 2")[0]).toBeInTheDocument();
        expect(screen.getAllByText("completed")[0]).toBeInTheDocument();
    });

    it("renders table headers", () => {
        render(<TaskTable tasks={mockTasks} />);

        expect(screen.getAllByText("Task")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Description")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Status")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Actions")[0]).toBeInTheDocument();
    });

    it("shows empty state", () => {
        render(<TaskTable tasks={[]} />);
        expect(screen.getAllByText("No tasks available")[0]).toBeInTheDocument();
    });
});
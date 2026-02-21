import { act } from "@testing-library/react";
import { useTasksStore } from "../tasks.store";
import type { Task } from "../tasks.type";
import {
    fetchTasksApi,
    createTaskApi,
    updateTaskApi,
    deleteTaskApi,
} from "../tasks.api";

jest.mock("../tasks.api", () => ({
    fetchTasksApi: jest.fn(),
    createTaskApi: jest.fn(),
    updateTaskApi: jest.fn(),
    deleteTaskApi: jest.fn(),
}));

const mockTask: Task = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    status: "pending" as const,
    createdAt: new Date().toISOString(),
};

describe("Tasks Store", () => {
    beforeEach(() => {
        useTasksStore.setState({
            tasks: [],
            loading: false,
            error: null,
        });
    });

    it("fetchTasks sets tasks on success", async () => {
        (fetchTasksApi as jest.Mock).mockResolvedValue([mockTask]);

        await act(async () => {
            await useTasksStore.getState().fetchTasks();
        });

        const state = useTasksStore.getState();
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(Array.isArray(state.tasks)).toBe(true);
    });

    it("fetchTasks sets error on failure", async () => {
        (fetchTasksApi as jest.Mock).mockRejectedValue(
            new Error("Failed to fetch tasks")
        );

        await act(async () => {
            await useTasksStore.getState().fetchTasks();
        });

        const state = useTasksStore.getState();
        expect(state.loading).toBe(false);
        expect(state.error).toBe("Failed to fetch tasks");
    });

    it("fetchTasks sets loading true during fetch", async () => {
        let resolveFetch: (value: Task[]) => void;
        const fetchPromise = new Promise<Task[]>((resolve) => {
            resolveFetch = resolve;
        });
        (fetchTasksApi as jest.Mock).mockReturnValue(fetchPromise);

        const fetchPromiseAct = act(async () => {
            useTasksStore.getState().fetchTasks();
        });

        expect(useTasksStore.getState().loading).toBe(true);

        resolveFetch!([]);
        await fetchPromiseAct;
        expect(useTasksStore.getState().loading).toBe(false);
    });

    it("should create a task", async () => {
        const created: Task = {
            id: "new-1",
            title: "Test Task",
            description: "Test Description",
            status: "pending",
            createdAt: new Date().toISOString(),
        };
        (createTaskApi as jest.Mock).mockResolvedValue(created);

        await act(async () => {
            await useTasksStore.getState().createTask({
                title: "Test Task",
                description: "Test Description",
                status: "pending",
            });
        });

        const tasks = useTasksStore.getState().tasks;
        expect(tasks.length).toBe(1);
        expect(tasks[0].title).toBe("Test Task");
    });

    it("should update a task", async () => {
        useTasksStore.setState({ tasks: [mockTask] });
        const updated: Task = { ...mockTask, title: "Updated" };
        (updateTaskApi as jest.Mock).mockResolvedValue(updated);

        await act(async () => {
            await useTasksStore.getState().updateTask("1", { title: "Updated" });
        });

        expect(useTasksStore.getState().tasks[0].title).toBe("Updated");
    });

    it("should delete a task", async () => {
        useTasksStore.setState({ tasks: [mockTask] });
        (deleteTaskApi as jest.Mock).mockResolvedValue(undefined);

        await act(async () => {
            await useTasksStore.getState().deleteTask("1");
        });

        expect(useTasksStore.getState().tasks.length).toBe(0);
    });
});
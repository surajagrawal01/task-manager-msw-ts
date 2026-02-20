import { create } from "zustand";
import type { Task } from "./tasks.type";
import {
    fetchTasksApi,
    createTaskApi,
    updateTaskApi,
    deleteTaskApi,
} from "./tasks.api";

interface TasksState {
    tasks: Task[];
    loading: boolean;
    error: string | null;

    fetchTasks: () => Promise<void>;
    createTask: (data: Omit<Task, "id" | "createdAt">) => Promise<void>;
    updateTask: (id: string, data: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useTasksStore = create<TasksState>((set) => ({
    tasks: [],
    loading: false,
    error: null,

    fetchTasks: async () => {
        set({ loading: true, error: null });
        try {
            const tasks = await fetchTasksApi();
            set({ tasks });
        } catch (err) {
            set({ error: (err as Error).message });
        } finally {
            set({ loading: false });
        }
    },

    clearError: () => set({ error: null }),

    createTask: async (data) => {
        const newTask = await createTaskApi(data);
        set((state) => ({
            tasks: [...state.tasks, newTask],
        }));
    },

    updateTask: async (id, data) => {
        const updated = await updateTaskApi(id, data);
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? updated : t
            ),
        }));
    },

    deleteTask: async (id) => {
        await deleteTaskApi(id);
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
        }));
    },
}));

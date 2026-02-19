import { Task } from "@/feature/tasks/tasks.type";

const STORAGE_KEY = "msw-tasks";

export function getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveTasks(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

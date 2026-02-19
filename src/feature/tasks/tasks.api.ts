import type { Task } from "./tasks.type";

const BASE_URL = "/tasks";

export async function fetchTasksApi(): Promise<Task[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
}

export async function createTaskApi(
    data: Omit<Task, "id" | "createdAt">
): Promise<Task> {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
}

export async function updateTaskApi(
    id: string,
    data: Partial<Task>
): Promise<Task> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
}

export async function deleteTaskApi(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete task");
}

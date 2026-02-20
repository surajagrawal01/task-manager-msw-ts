import { rest } from "msw";
import type { Task } from "../feature/tasks/tasks.type";
import { getTasks, saveTasks } from "./storage";

export const handlers = [
    rest.post("/login", (req, res, ctx) => {
        const { username, password } = req.body as {
            username: string;
            password: string;
        };

        if (username === "test" && password === "test123") {
            return res(
                ctx.status(200),
                ctx.json({ token: "fake-jwt-token" })
            );
        }

        return res(
            ctx.status(401),
            ctx.json({ message: "Invalid credentials" })
        );
    }),
    rest.get("/tasks", (req, res, ctx) => {
        const tasks = getTasks();
        return res(ctx.json(tasks));
    }),
    rest.post("/tasks", async (req, res, ctx) => {
        const tasks = getTasks();
        const data = await req.json();

        const newTask: Task = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        const updatedTasks = [...tasks, newTask];
        saveTasks(updatedTasks);

        return res(ctx.json(newTask));
    }),

    rest.put("/tasks/:id", async (req, res, ctx) => {
        const tasks = getTasks();
        const { id } = req.params;
        const data = await req.json();

        const updatedTasks = tasks.map((task) =>
            task.id === id ? { ...task, ...data } : task
        );

        saveTasks(updatedTasks);

        const updated = updatedTasks.find((t) => t.id === id);

        return res(ctx.json(updated));
    }),

    rest.delete("/tasks/:id", (req, res, ctx) => {
        const tasks = getTasks();
        const { id } = req.params;

        const updatedTasks = tasks.filter(
            (task) => task.id !== id
        );

        saveTasks(updatedTasks);

        return res(ctx.status(200));
    }),
];

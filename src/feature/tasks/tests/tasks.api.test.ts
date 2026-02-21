import { rest } from "msw";
import { server } from "../../../tests/server";
import {
    fetchTasksApi,
    createTaskApi,
    updateTaskApi,
    deleteTaskApi,
} from "../tasks.api";

describe("tasks.api", () => {
    it("fetchTasksApi returns tasks on success", async () => {
        const tasks = await fetchTasksApi();
        expect(Array.isArray(tasks)).toBe(true);
    });

    it("fetchTasksApi throws on failure", async () => {
        server.use(
            rest.get("/tasks", (_req, res, ctx) =>
                res(ctx.status(500))
            )
        );
        await expect(fetchTasksApi()).rejects.toThrow("Failed to fetch tasks");
    });

    it("createTaskApi returns new task on success", async () => {
        const task = await createTaskApi({
            title: "New",
            description: "Desc",
            status: "pending",
        });
        expect(task).toMatchObject({
            title: "New",
            description: "Desc",
            status: "pending",
        });
        expect(task.id).toBeDefined();
        expect(task.createdAt).toBeDefined();
    });

    it("createTaskApi throws on failure", async () => {
        server.use(
            rest.post("/tasks", (_req, res, ctx) =>
                res(ctx.status(500))
            )
        );
        await expect(
            createTaskApi({
                title: "New",
                description: "Desc",
                status: "pending",
            })
        ).rejects.toThrow("Failed to create task");
    });

    it("updateTaskApi returns updated task on success", async () => {
        const created = await createTaskApi({
            title: "To Update",
            description: "D",
            status: "pending",
        });
        const updated = await updateTaskApi(created.id, { title: "Updated" });
        expect(updated.title).toBe("Updated");
    });

    it("updateTaskApi throws on failure", async () => {
        server.use(
            rest.put("/tasks/:id", (_req, res, ctx) =>
                res(ctx.status(404))
            )
        );
        await expect(
            updateTaskApi("non-existent", { title: "X" })
        ).rejects.toThrow("Failed to update task");
    });

    it("deleteTaskApi resolves on success", async () => {
        const created = await createTaskApi({
            title: "To Delete",
            description: "D",
            status: "pending",
        });
        await expect(deleteTaskApi(created.id)).resolves.toBeUndefined();
    });

    it("deleteTaskApi throws on failure", async () => {
        server.use(
            rest.delete("/tasks/:id", (_req, res, ctx) =>
                res(ctx.status(500))
            )
        );
        await expect(deleteTaskApi("any-id")).rejects.toThrow(
            "Failed to delete task"
        );
    });
});
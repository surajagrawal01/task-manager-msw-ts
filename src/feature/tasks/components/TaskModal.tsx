import { useState } from "react";
import { useTasksStore } from "../tasks.store";
import type { Task, TaskStatus } from "../tasks.type";

interface Props {
    mode: "create" | "edit";
    task?: Task;
    onClose: () => void;
}

export default function TaskModal({ mode, task, onClose }: Props) {
    const createTask = useTasksStore((s) => s.createTask);
    const updateTask = useTasksStore((s) => s.updateTask);

    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(
        task?.description || ""
    );
    const [status, setStatus] = useState<TaskStatus>(
        task?.status || "pending"
    );

    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!description.trim()) {
            newErrors.description = "Description is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const payload = {
            title: title.trim(),
            description: description.trim(),
            status,
        };

        if (mode === "create") {
            await createTask(payload);
        } else if (task) {
            await updateTask(task.id, payload);
        }

        onClose();
    };

    const isFormValid =
        title.trim().length > 0 && description.trim().length > 0;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 dark:bg-black/60">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg dark:bg-gray-800 dark:shadow-none">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {mode === "create" ? "Create Task" : "Edit Task"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Title */}
                    <div>
                        <input
                            type="text"
                            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${errors.title
                                ? "border-red-500 focus:ring-red-300"
                                : "focus:ring-blue-400 border-gray-300"
                                }`}
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1 dark:text-red-400">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <textarea
                            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${errors.description
                                ? "border-red-500 focus:ring-red-300"
                                : "focus:ring-blue-400 border-gray-300"
                                }`}
                            placeholder="Description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1 dark:text-red-400">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value as TaskStatus)
                        }
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">
                            In Progress
                        </option>
                        <option value="completed">Completed</option>
                    </select>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`px-4 py-2 text-white rounded transition ${isFormValid
                                ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                : "bg-blue-300 cursor-not-allowed dark:bg-blue-900/50"
                                }`}
                        >
                            {mode === "create" ? "Create" : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

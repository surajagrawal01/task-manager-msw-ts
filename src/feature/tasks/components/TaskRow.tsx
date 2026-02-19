import { useState } from "react";
import { useTasksStore } from "../tasks.store";
import type { Task } from "../tasks.type";
import TaskModal from "./TaskModal";
import Tooltip from "@/shared/components/Tooltip";
import { RefreshCcw, Pencil, Trash2 } from "lucide-react";

interface Props {
    task: Task;
}

export default function TaskRow({ task }: Props) {
    const deleteTask = useTasksStore((s) => s.deleteTask);
    const updateTask = useTasksStore((s) => s.updateTask);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const nextStatus =
        task.status === "pending"
            ? "in-progress"
            : task.status === "in-progress"
                ? "completed"
                : "pending";

    const formattedDate = new Date(task.createdAt).toLocaleDateString();

    return (
        <>
            <tr className="border-t hover:bg-gray-50">

                <td className="px-4 py-3 align-top">

                    <Tooltip content={task.title}>
                        <div className="font-medium truncate">
                            {task.title}
                        </div>
                    </Tooltip>

                    <div className="text-xs text-gray-400 mt-1 lg:hidden">
                        {formattedDate}
                    </div>

                    <Tooltip content={task.description}>
                        <div className="mt-1 text-gray-500 text-sm truncate md:hidden">
                            {task.description || "No description"}
                        </div>
                    </Tooltip>

                </td>

                <td className="hidden md:table-cell px-4 py-3 text-gray-500">
                    <Tooltip content={task.description}>
                        <div className="truncate">
                            {task.description || "No description"}
                        </div>
                    </Tooltip>
                </td>

                <td className="hidden lg:table-cell px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded-full whitespace-nowrap">
                        {task.status}
                    </span>
                </td>

                <td className="hidden lg:table-cell px-4 py-3 text-gray-500">
                    {formattedDate}
                </td>

                <td className="px-4 py-3 text-right lg:hidden">
                    <div className="flex flex-col items-end gap-2">

                        <span className="text-xs px-3 py-1 bg-gray-200 rounded-full whitespace-nowrap">
                            {task.status}
                        </span>

                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    updateTask(task.id, { status: nextStatus })
                                }
                                className="text-blue-600"
                            >
                                <RefreshCcw className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="text-yellow-600"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                    </div>
                </td>

                <td className="hidden lg:table-cell px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() =>
                                updateTask(task.id, { status: nextStatus })
                            }
                            className="text-blue-600"
                        >
                            <RefreshCcw className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="text-yellow-600"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>

            </tr>

            {isEditOpen && (
                <TaskModal
                    mode="edit"
                    task={task}
                    onClose={() => setIsEditOpen(false)}
                />
            )}
        </>
    );
}

import { useEffect, useMemo, useState } from "react";
import { useTasksStore } from "../tasks.store";
import TaskTable from "../components/TaskTable";
import TaskModal from "../components/TaskModal";

const STATUS_FILTER_OPTIONS = [
    { value: "", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "in-progress", label: "In progress" },
] as const;

export function DashboardPage() {
    const { tasks, fetchTasks } = useTasksStore();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesTitle = !searchQuery.trim() ||
                task.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
            const statusForFilter = task.status;
            const matchesStatus = !statusFilter || statusForFilter === statusFilter;
            return matchesTitle && matchesStatus;
        });
    }, [tasks, searchQuery, statusFilter]);

    return (
        <div className="mx-auto h-full flex flex-col pb-4">

            <div className="mb-6">

                <div className="hidden lg:flex justify-between items-center">

                    <div className="flex items-center gap-4">

                        <h1 className="text-3xl font-bold whitespace-nowrap">
                            Dashboard
                        </h1>

                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-44 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {STATUS_FILTER_OPTIONS.map((opt) => (
                                <option key={opt.value || "all"} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
                    >
                        + Add Task
                    </button>
                </div>


                <div className="lg:hidden space-y-3">

                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">
                            Dashboard
                        </h1>

                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            + Add Task
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">

                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {STATUS_FILTER_OPTIONS.map((opt) => (
                                <option key={opt.value || "all"} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white shadow rounded-lg p-4 overflow-auto">
                <TaskTable tasks={filteredTasks} />
            </div>

            {isCreateOpen && (
                <TaskModal
                    mode="create"
                    onClose={() => setIsCreateOpen(false)}
                />
            )}
        </div>
    );
}

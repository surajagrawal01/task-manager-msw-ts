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
    const { tasks, loading, error, fetchTasks, clearError } = useTasksStore();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        clearError();
    }, [searchQuery, statusFilter, clearError]);

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

            {error && (
                <div
                    className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200"
                    role="alert"
                >
                    <span className="text-sm font-medium">{error}</span>
                    <div className="flex shrink-0 gap-2">
                        <button
                            type="button"
                            onClick={() => fetchTasks()}
                            className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                        >
                            Retry
                        </button>
                        <button
                            type="button"
                            onClick={clearError}
                            className="rounded border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:bg-transparent dark:text-red-200 dark:hover:bg-red-900/30"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-6">

                <div className="hidden lg:flex justify-between items-center">

                    <div className="flex items-center gap-4">

                        <h1 className="text-3xl font-bold whitespace-nowrap text-gray-900 dark:text-gray-100">
                            Dashboard
                        </h1>

                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-44 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
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
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        + Add Task
                    </button>
                </div>


                <div className="lg:hidden space-y-3">

                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Dashboard
                        </h1>

                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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
                            className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
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

            <div className="flex-1 bg-white shadow rounded-lg p-4 overflow-auto dark:bg-gray-800 dark:shadow-none">
                {loading ? (
                    <div className="flex flex-col gap-3 py-4" aria-busy="true" aria-label="Loading tasks">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-14 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                            />
                        ))}
                    </div>
                ) : (
                    <TaskTable tasks={filteredTasks} />
                )}
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
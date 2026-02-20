import { Task } from "../tasks.type";
import TaskRow from "./TaskRow";

interface Props {
    tasks: Task[];
}

export default function TaskTable({ tasks }: Props) {
    if (tasks.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8 dark:text-gray-400">
                No tasks available
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
            <table className="w-full table-fixed border-collapse text-sm">
                <thead className="bg-gray-100 text-left dark:bg-gray-700">
                    <tr>

                        <th className="px-4 py-3 w-[60%] md:w-[45%] lg:w-[25%] text-gray-900 dark:text-gray-100">
                            Task
                        </th>

                        <th className="hidden md:table-cell px-4 py-3 w-[30%] lg:w-[25%] text-gray-900 dark:text-gray-100">
                            Description
                        </th>

                        <th className="hidden lg:table-cell px-4 py-3 w-[15%] text-gray-900 dark:text-gray-100">
                            Status
                        </th>

                        <th className="hidden lg:table-cell px-4 py-3 w-[15%] text-gray-900 dark:text-gray-100">
                            Created
                        </th>

                        <th className="px-4 py-3 text-right w-[40%] md:w-[25%] lg:w-[20%] text-gray-900 dark:text-gray-100">
                            <span className="lg:hidden">Manage</span>
                            <span className="hidden lg:inline">Actions</span>
                        </th>

                    </tr>
                </thead>

                <tbody>
                    {tasks.map((task) => (
                        <TaskRow key={task.id} task={task} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
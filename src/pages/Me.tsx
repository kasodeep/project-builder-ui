import { useEffect, useMemo, useState } from "react"
import { fetchTaskForUser } from "../api/me.api"
import { EisenhowerMatrix } from "../components/me/EisenhowerMatrix"
import { TaskCard } from "../components/me/TaskCard"
import { Status, type Task } from "../types/task"
import { Spinner } from "../components/ui/spinner"

export const URGENT_PRIORITY = 4
const URGENT_DATE = 5

export default function Me() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTaskForUser()
            .then(setTasks)
            .finally(() => setLoading(false))
    }, [])

    const onComplete = (taskId: string) => {
        console.log("Completing:", taskId)
    }

    // Active tasks for quadrants
    const quadrants = useMemo(() => {
        const buckets = { do: [], schedule: [], delegate: [], eliminate: [] } as Record<string, Task[]>
        const activeTasks = tasks.filter(t => t.status === Status.ACTIVE || t.status === Status.PENDING)

        activeTasks.forEach(task => {
            const due = task.end ? new Date(task.end) : null
            const isUrgent = due ? (due.getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= URGENT_DATE : false
            const isImportant = (task.priority ?? 0) >= URGENT_PRIORITY

            if (isUrgent && isImportant) buckets.do.push(task)
            else if (!isUrgent && isImportant) buckets.schedule.push(task)
            else if (isUrgent && !isImportant) buckets.delegate.push(task)
            else buckets.eliminate.push(task)
        })
        return buckets
    }, [tasks])

    // Completed and Locked tasks
    const completedTasks = useMemo(() => tasks.filter(t => t.status === Status.COMPLETED), [tasks])
    const lockedTasks = useMemo(() => tasks.filter(t => t.status === Status.LOCKED), [tasks])

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-1">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Personal Dashboard</h1>
                <p className="text-slate-500 font-medium">Manage your workload and focus on what matters.</p>
            </header>

            {loading ? (
                <Spinner className="h-10 w-10" />
            ) : (
                <>
                    {/* matrix for active tasks */}
                    <section>
                        <EisenhowerMatrix tasks={quadrants} onComplete={onComplete} />
                    </section>

                    {/* bottom sections: completed & locked side by side */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        {/* Completed Tasks */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Completed Recently</h2>
                            {completedTasks.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No tasks completed recently.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {completedTasks.map(task => (
                                        <div key={task.id} className="opacity-60 grayscale-[0.5]">
                                            <TaskCard task={task} onComplete={onComplete} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Locked Tasks */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Locked Tasks</h2>
                            {lockedTasks.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No locked tasks.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {lockedTasks.map(task => (
                                        <div key={task.id} className="opacity-50 grayscale-[0.7]">
                                            <TaskCard task={task} onComplete={onComplete} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}

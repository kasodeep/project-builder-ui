import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store"
import { fetchTaskById, fetchTasksForProject, openCreateSidebar } from "../store/task.slice"
import TaskGraph from "../components/task/TaskGraph"
import TaskDetails from "../components/task/TaskDetails"
import TaskSidebar from "../components/task/TaskSidebar"
import { useParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Plus, AlertCircle, RefreshCw } from "lucide-react"

export default function Dashboard() {
    const { projectId } = useParams()
    const dispatch = useDispatch<AppDispatch>()

    const { tasks, status, error, selectedTask, selectedStatus } = useSelector(
        (s: RootState) => s.task
    )

    const handleSelect = (taskId: string) => {
        dispatch(fetchTaskById(taskId))
    }

    const handleRefetch = () => {
        if (projectId) dispatch(fetchTasksForProject(projectId))
    }

    useEffect(() => {
        if (projectId) {
            dispatch(fetchTasksForProject(projectId))
        }
    }, [projectId, dispatch])

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-110px)] text-slate-500">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                    <p className="text-sm font-medium">Loading project graph…</p>
                </div>
            </div>
        )
    }

    if (status === "failed") {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-110px)]">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                    <p className="text-sm font-medium text-slate-700">Failed to load tasks</p>
                    {error && <p className="text-xs text-slate-400">{error}</p>}
                    <Button variant="outline" size="sm" className="gap-2 mt-1" onClick={handleRefetch}>
                        <RefreshCw className="h-3.5 w-3.5" />
                        Try again
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col h-[calc(100vh-100px)] gap-0">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 px-1">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">Task Graph</h1>
                        <p className="text-sm text-slate-500 mt-0.5">{tasks.length} task{tasks.length !== 1 ? "s" : ""} in this project</p>
                    </div>

                    <Button onClick={() => dispatch(openCreateSidebar())} className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Task
                    </Button>
                </div>

                {/* Main content */}
                <div className="flex gap-3 flex-1 min-h-0">
                    <div className="w-[65%] min-w-0">
                        <TaskGraph tasks={tasks} onSelect={handleSelect} />
                    </div>
                    <div className="w-[35%] min-w-0">
                        <TaskDetails task={selectedTask} status={selectedStatus} />
                    </div>
                </div>
            </div>

            <TaskSidebar />
        </>
    )
}
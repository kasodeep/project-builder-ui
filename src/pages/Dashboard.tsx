import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { fetchTaskById, fetchTasksForProject, openCreateSidebar } from "@/store/task.slice"
import TaskGraph from "@/components/task/TaskGraph"
import TaskDetails from "@/components/task/TaskDetails"
import TaskSidebar from "@/components/task/TaskSidebar"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle, RefreshCw, GitBranch, Info, X } from "lucide-react"

export default function Dashboard() {
    const { projectId } = useParams()
    const dispatch = useDispatch<AppDispatch>()

    const { tasks, status, error, selectedTask, selectedStatus } = useSelector(
        (s: RootState) => s.task
    )

    // On mobile, details panel slides in as a sheet when a task is selected
    const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false)

    const handleSelect = (taskId: string) => {
        dispatch(fetchTaskById(taskId))
        setMobileDetailsOpen(true)
    }

    const handleRefetch = () => {
        if (projectId) dispatch(fetchTasksForProject(projectId))
    }

    const handleCloseDetails = () => {
        setMobileDetailsOpen(false)
    }

    useEffect(() => {
        if (projectId) {
            dispatch(fetchTasksForProject(projectId))
        }
    }, [projectId, dispatch])

    // ── Loading ────────────────────────────────────────────────────────────
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

    // ── Error ──────────────────────────────────────────────────────────────
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

    // ── Main ───────────────────────────────────────────────────────────────
    return (
        <>
            <div className="flex flex-col h-[calc(100vh-100px)] gap-0">

                {/* Header */}
                <div className="flex justify-between items-center mb-4 px-1">
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                            Task Graph
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            {tasks.length} task{tasks.length !== 1 ? "s" : ""} in this project
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Mobile: hint that tapping a node opens details */}
                        {selectedTask && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 lg:hidden text-violet-600 border-violet-200 hover:bg-violet-50"
                                onClick={() => setMobileDetailsOpen(true)}
                            >
                                <Info className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Details</span>
                            </Button>
                        )}

                        <Button onClick={() => dispatch(openCreateSidebar())} className="gap-2" size="sm">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">New Task</span>
                            <span className="sm:hidden">New</span>
                        </Button>
                    </div>
                </div>

                {/* Main content — side-by-side on lg+, stacked on smaller */}
                <div className="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">

                    {/* Graph — full width on mobile, 65% on desktop */}
                    <div className="lg:w-[65%] w-full flex-1 lg:flex-none min-h-0">
                        <TaskGraph tasks={tasks} onSelect={handleSelect} />
                    </div>

                    {/* Details panel — hidden on mobile (opens as overlay), visible on lg+ */}
                    <div className="hidden lg:block lg:w-[35%] min-h-0 overflow-auto">
                        <TaskDetails task={selectedTask} status={selectedStatus} />
                    </div>
                </div>
            </div>

            {/* Mobile details overlay — slides up when a task is selected */}
            {mobileDetailsOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={handleCloseDetails}
                    />

                    {/* Sheet */}
                    <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[75vh] flex flex-col animate-in slide-in-from-bottom duration-300">
                        {/* Handle + close */}
                        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100 shrink-0">
                            <div className="flex items-center gap-2 text-slate-700">
                                <GitBranch className="h-4 w-4 text-violet-500" />
                                <span className="text-sm font-semibold">Task Details</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-slate-600"
                                onClick={handleCloseDetails}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Scrollable details content */}
                        <div className="overflow-auto flex-1 p-4">
                            <TaskDetails task={selectedTask} status={selectedStatus} />
                        </div>
                    </div>
                </div>
            )}

            <TaskSidebar />
        </>
    )
}
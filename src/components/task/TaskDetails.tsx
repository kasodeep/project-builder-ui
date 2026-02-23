import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { openEditSidebar, deleteTask, fetchTeamUsers, fetchFeatures } from "@/store/task.slice"
import type { AppDispatch, RootState } from "@/store"
import type { Task } from "@/types/task"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Pencil, Calendar, Flag, Layers, Clock, GitBranch, User } from "lucide-react"
import DeleteTaskDialog from "./DeleteTaskDialog"

type Props = {
    task: Task | null
    status: string
}

// ─── Constants ────────────────────────────────────────────────────────────────
export const STATUS_COLORS: Record<string, string> = {
    LOCKED: "bg-slate-100 text-slate-600 border-slate-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ARCHIVED: "bg-slate-50 text-slate-500 border-slate-200",
}

const priorityColor = (p: number | null) => {
    if (!p) return "text-slate-400"
    if (p >= 8) return "text-red-600"
    if (p >= 5) return "text-amber-600"
    return "text-emerald-600"
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-2.5">
            <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 leading-none mb-1">
                    {label}
                </p>
                <div className="text-sm font-medium text-slate-800">
                    {value ?? <span className="text-slate-400 font-normal italic">Not set</span>}
                </div>
            </div>
        </div>
    )
}

function LoadingState() {
    return (
        <Card className="h-full">
            <CardContent className="p-6 flex items-center gap-3 text-slate-500">
                <div className="h-4 w-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                Loading task details...
            </CardContent>
        </Card>
    )
}

function EmptyState() {
    return (
        <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center gap-3 text-center">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <GitBranch className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                    <p className="font-semibold text-slate-700">No task selected</p>
                    <p className="text-sm text-slate-400 mt-1">Click a node in the graph to view task details</p>
                </div>
            </CardContent>
        </Card>
    )
}

function TaskHeader({ task, onEdit, onDelete }: {
    task: Task
    onEdit: () => void
    onDelete: () => void
}) {
    return (
        <CardHeader className="pb-2 border-b border-slate-100 shrink-0">
            <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-bold text-slate-900 leading-tight line-clamp-2 flex-1 min-w-0">
                    {task.name}
                </CardTitle>
                {task.status && (
                    <Badge className={`shrink-0 text-[10px] tracking-wider ${STATUS_COLORS[task.status]}`}>
                        {task.status}
                    </Badge>
                )}
            </div>

            <div className="flex items-center gap-2 mt-3">
                <Button size="sm" variant="outline" className="gap-1 h-8 text-xs flex-1" onClick={onEdit}>
                    <Pencil className="h-3 w-3" />
                    Edit
                </Button>
                <DeleteTaskDialog task={task} onDelete={onDelete} />
            </div>
        </CardHeader>
    )
}

function TaskMeta({ task }: { task: Task }) {
    return (
        <div className="px-5 divide-y divide-slate-50">
            <InfoRow
                icon={<Layers className="h-3.5 w-3.5" />}
                label="Feature"
                value={task.feature?.name}
            />
            <InfoRow
                icon={<Flag className="h-3.5 w-3.5" />}
                label="Priority"
                value={
                    task.priority != null ? (
                        <span className={`font-bold ${priorityColor(task.priority)}`}>
                            {task.priority} / 10
                        </span>
                    ) : null
                }
            />
            <InfoRow
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Timeline"
                value={task.start && task.end ? <span>{task.start} → {task.end}</span> : null}
            />
            <InfoRow
                icon={<User className="h-3.5 w-3.5" />}
                label="Updated By"
                value={task.updatedBy}
            />
            <InfoRow
                icon={<Clock className="h-3.5 w-3.5" />}
                label="Started At"
                value={task.startedAt}
            />
            <InfoRow
                icon={<Clock className="h-3.5 w-3.5" />}
                label="Completed At"
                value={task.completedAt}
            />
        </div>
    )
}

function AssigneeList({ assignees }: { assignees: { id: string; label: string }[] }) {
    if (assignees.length === 0) return null
    return (
        <>
            <Separator className="my-1" />
            <div className="px-5 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Assignees ({assignees.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {assignees.map(({ id, label }) => (
                        <Badge key={id} variant="secondary" className="text-xs gap-1.5">
                            <div className="h-3.5 w-3.5 rounded-full bg-blue-300 flex items-center justify-center text-[8px] font-bold text-slate-600">
                                {label.slice(0, 1).toUpperCase()}
                            </div>
                            {label}
                        </Badge>
                    ))}
                </div>
            </div>
        </>
    )
}

function DependencyList({ dependencies }: { dependencies: { id: string; label: string }[] }) {
    if (dependencies.length === 0) return null
    return (
        <>
            <Separator className="my-1" />
            <div className="px-5 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Dependencies ({dependencies.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {dependencies.map(({ id, label }) => (
                        <Badge key={id} variant="outline" className="text-xs gap-1.5">
                            <GitBranch className="h-3 w-3 text-slate-400" />
                            {label}
                        </Badge>
                    ))}
                </div>
            </div>
        </>
    )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TaskDetails({ task, status }: Props) {
    const dispatch = useDispatch<AppDispatch>()

    const { teamUsers, teamUsersStatus, featuresStatus, tasks } = useSelector((s: RootState) => s.task)
    const teamId = useSelector((s: RootState) => s.auth.teamId)

    useEffect(() => {
        if (featuresStatus === "idle") dispatch(fetchFeatures())
    }, [featuresStatus, dispatch])

    useEffect(() => {
        if (!teamId) return
        if (teamUsersStatus === "idle" || teamUsersStatus === "failed") {
            dispatch(fetchTeamUsers(teamId))
        }
    }, [teamId, teamUsersStatus, dispatch])

    if (status === "loading") return <LoadingState />
    if (!task) return <EmptyState />

    const resolvedAssignees = (task.assignees ?? []).map(id => ({
        id,
        label: teamUsers.find(u => u.id === id)?.username ?? id.slice(0, 8) + "…",
    }))

    const resolvedDependencies = (task.dependencies ?? []).map(id => ({
        id,
        label: tasks.find(t => t.id === id)?.name ?? id.slice(0, 8) + "…",
    }))

    return (
        <Card className="h-full flex flex-col overflow-hidden">
            <TaskHeader
                task={task}
                onEdit={() => dispatch(openEditSidebar(task))}
                onDelete={() => dispatch(deleteTask(task.id))}
            />
            <CardContent className="flex-1 overflow-auto p-0">
                <TaskMeta task={task} />
                <AssigneeList assignees={resolvedAssignees} />
                <DependencyList dependencies={resolvedDependencies} />
            </CardContent>
        </Card>
    )
}
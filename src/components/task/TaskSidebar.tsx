import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { RootState, AppDispatch } from "../../store"
import {
    closeSidebar, createTask, updateTask,
    updateAssignees, updateDependencies,
    fetchFeatures, fetchTeamUsers,
} from "../../store/task.slice"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select"
import { Badge } from "../ui/badge"
import { X, Loader2, UserCircle, GitBranch, Settings2 } from "lucide-react"
import { Status } from "../../types/task"
import type { Feature, Task } from "../../types/task"
import type { UserDto } from "../../types/user"
import { useParams } from "react-router-dom"
import { cn } from "../../lib/utils"
import {
    createTaskSchema, updateTaskSchema,
    type CreateTaskInput, type UpdateTaskInput,
} from "../../schema/task.schema"

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "basic" | "assignees" | "dependencies"

// ─── Constants ────────────────────────────────────────────────────────────────
const TAB_ICONS: Record<Tab, React.ReactNode> = {
    basic: <Settings2 className="h-3.5 w-3.5" />,
    assignees: <UserCircle className="h-3.5 w-3.5" />,
    dependencies: <GitBranch className="h-3.5 w-3.5" />,
}

// ─── Sub-components ───────────────────────────────────────────────────────────
// edit tabs headings.
function SidebarTabs({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
    return (
        <div className="flex border-b border-slate-100 shrink-0 px-1">
            {(["basic", "assignees", "dependencies"] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold capitalize tracking-wide transition-colors relative",
                        active === tab ? "text-violet-700" : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    {TAB_ICONS[tab]}
                    {tab}
                    {active === tab && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-violet-600 rounded-full" />
                    )}
                </button>
            ))}
        </div>
    )
}

// use for create and update
function BasicTab({
    register, control, errors, features, featuresStatus,
}: {
    register: any
    control: any
    errors: any
    features: Feature[]
    featuresStatus: string
}) {
    return (
        <form id="task-form" className="px-6 py-5 space-y-5">
            {/* name */}
            <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Task Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    placeholder="e.g. Implement auth middleware"
                    {...register("name")}
                    className={cn(errors.name && "border-red-300 focus-visible:ring-red-300")}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* feature */}
            <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Feature <span className="text-red-500">*</span>
                </Label>
                <Controller
                    control={control}
                    name="featureId"
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className={cn(errors.featureId && "border-red-300")}>
                                {featuresStatus === "loading"
                                    ? <span className="flex items-center gap-2 text-slate-400">
                                        <Loader2 className="h-3 w-3 animate-spin" />Loading...
                                    </span>
                                    : <SelectValue placeholder="Select a feature" />
                                }
                            </SelectTrigger>
                            <SelectContent>
                                {features.map((f) => (
                                    <SelectItem key={f.id} value={f.id}>
                                        <span className="capitalize">{f.name}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.featureId && <p className="text-xs text-red-500">{errors.featureId.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">

                {/* priority */}
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Priority (1–10)
                    </Label>
                    <Input
                        type="number" min={1} max={10} placeholder="5"
                        {...register("priority", { valueAsNumber: true })}
                        className={cn(errors.priority && "border-red-300")}
                    />
                    {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
                </div>

                {/* status */}
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Status
                    </Label>
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(Status).map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s.charAt(0) + s.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

                {/* start */}
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Input type="date" {...register("start")} className={cn(errors.start && "border-red-300")} />
                    {errors.start && <p className="text-xs text-red-500">{errors.start.message}</p>}
                </div>

                {/* end */}
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        End Date <span className="text-red-500">*</span>
                    </Label>
                    <Input type="date" {...register("end")} className={cn(errors.end && "border-red-300")} />
                    {errors.end && <p className="text-xs text-red-500">{errors.end.message}</p>}
                </div>
            </div>
        </form>
    )
}

function CheckMark() {
    return (
        <div className="h-4 w-4 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
            <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
    )
}

function SelectableUserRow({ user, selected, onToggle }: {
    user: UserDto; selected: boolean; onToggle: () => void
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all",
                selected ? "border-violet-300 bg-violet-50" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                    selected ? "bg-violet-200 text-violet-800" : "bg-slate-100 text-slate-600"
                )}>
                    {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-800">{user.username}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user.role.toLowerCase()}</p>
                </div>
            </div>
            {selected && <CheckMark />}
        </button>
    )
}

function SelectableTaskRow({ task, selected, onToggle }: {
    task: Task; selected: boolean; onToggle: () => void
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all",
                selected ? "border-violet-300 bg-violet-50" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            )}
        >
            <div className="flex items-center gap-3">
                <div className={cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center shrink-0",
                    selected ? "bg-violet-200" : "bg-slate-100"
                )}>
                    <GitBranch className={cn("h-3.5 w-3.5", selected ? "text-violet-700" : "text-slate-500")} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-800">{task.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{task.feature?.name}</p>
                </div>
            </div>
            {selected && <CheckMark />}
        </button>
    )
}

function SelectedBadges({ ids, resolveLabel, onRemove }: {
    ids: string[]
    resolveLabel: (id: string) => string
    onRemove: (id: string) => void
}) {
    if (ids.length === 0) return null
    return (
        <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Selected ({ids.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
                {ids.map((id) => (
                    <Badge key={id} variant="default" className="gap-1 pr-1">
                        {resolveLabel(id)}
                        <button onClick={() => onRemove(id)} className="hover:text-red-500 transition-colors">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TaskSidebar() {
    const { projectId } = useParams()
    const dispatch = useDispatch<AppDispatch>()

    const {
        sidebarOpen, sidebarMode, editingTask, tasks,
        features, featuresStatus, teamUsers, teamUsersStatus,
    } = useSelector((s: RootState) => s.task)

    const teamId = useSelector((s: RootState) => s.auth.teamId)

    const isEdit = sidebarMode === "edit"
    const [activeTab, setActiveTab] = useState<Tab>("basic")
    const [assignees, setAssignees] = useState<string[]>([])
    const [assigneeSaving, setAssigneeSaving] = useState(false)
    const [dependencies, setDependencies] = useState<string[]>([])
    const [depSaving, setDepSaving] = useState(false)

    // getting the handlers for the form.
    const {
        register, handleSubmit, control, reset, formState: { errors, isSubmitting },
    } = useForm<CreateTaskInput | UpdateTaskInput>({
        resolver: zodResolver(isEdit ? updateTaskSchema : createTaskSchema),
        defaultValues: { name: "", featureId: "", priority: 5, status: undefined, start: "", end: "" },
    })

    // initial effect, setting the assignees, dependencies, edit values.
    useEffect(() => {
        if (!sidebarOpen) return
        if (isEdit && editingTask) {
            reset({
                id: editingTask.id,
                name: editingTask.name,
                featureId: editingTask.feature?.id ?? "",
                priority: editingTask.priority ?? undefined,
                status: editingTask.status ?? undefined,
                start: editingTask.start ?? "",
                end: editingTask.end ?? "",
            })
            setAssignees(editingTask.assignees ?? [])
            setDependencies(editingTask.dependencies ?? [])
        } else {
            reset({ name: "", featureId: "", priority: undefined, status: undefined, start: "", end: "" })
            setAssignees([])
            setDependencies([])
        }
        setActiveTab("basic")
    }, [sidebarOpen, sidebarMode, editingTask?.id])

    // fetch the features for new tasks, for old already done.
    useEffect(() => {
        if (sidebarOpen && featuresStatus === "idle") dispatch(fetchFeatures())
    }, [sidebarOpen, featuresStatus, dispatch])

    const handleClose = () => dispatch(closeSidebar())

    // submit the form.
    const onSubmit = async (data: CreateTaskInput | UpdateTaskInput) => {
        if (!projectId) return
        if (isEdit && editingTask) {
            await dispatch(updateTask({ ...(data as UpdateTaskInput), projectId }))
        } else {
            await dispatch(createTask({ ...(data as CreateTaskInput), projectId }))
        }
    }

    // submit the assignee and dependencies.
    const handleSaveAssignees = async () => {
        if (!editingTask) return
        setAssigneeSaving(true)
        await dispatch(updateAssignees({ taskId: editingTask.id, assignees }))
        setAssigneeSaving(false)
    }

    const handleSaveDependencies = async () => {
        if (!editingTask) return
        setDepSaving(true)
        await dispatch(updateDependencies({ taskId: editingTask.id, dependencies }))
        setDepSaving(false)
    }

    // helpers for frontend.
    const toggleAssignee = (id: string) =>
        setAssignees(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])

    const toggleDependency = (id: string) =>
        setDependencies(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id])

    const resolveUsername = (id: string) =>
        teamUsers.find(u => u.id === id)?.username ?? id.slice(0, 8) + "…"

    const resolveTaskName = (id: string) =>
        tasks.find(t => t.id === id)?.name ?? id.slice(0, 8) + "…"

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/25 backdrop-blur-[2px] z-40 transition-all duration-300",
                    sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={handleClose}
            />

            {/* Panel */}
            <div className={cn(
                "fixed top-0 right-0 h-full w-110 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
                sidebarOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* header + close */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            {isEdit ? "Edit Task" : "New Task"}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isEdit ? `Editing: ${editingTask?.name}` : "Add a task to this project"}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handleClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* edit nav headers */}
                {isEdit && <SidebarTabs active={activeTab} onChange={setActiveTab} />}

                {/* Body */}
                <div className="flex-1 overflow-y-auto">

                    {activeTab === "basic" && (
                        <BasicTab
                            register={register}
                            control={control}
                            errors={errors}
                            features={features}
                            featuresStatus={featuresStatus}
                        />
                    )}

                    {activeTab === "assignees" && (
                        <div className="px-6 py-5 space-y-5">
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Select team members to assign to this task. This replaces the current assignees.
                            </p>

                            <SelectedBadges ids={assignees} resolveLabel={resolveUsername} onRemove={toggleAssignee} />

                            {teamUsersStatus === "loading" && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Loading team members…
                                </div>
                            )}
                            {teamUsersStatus === "failed" && (
                                <div className="text-sm text-red-500">
                                    Failed to load team members.{" "}
                                    <button className="underline font-medium"
                                        onClick={() => teamId && dispatch(fetchTeamUsers(teamId))}>
                                        Retry
                                    </button>
                                </div>
                            )}
                            {!teamId && teamUsersStatus !== "loading" && teamUsersStatus !== "succeeded" && (
                                <p className="text-sm text-amber-500">Team info not available. Try refreshing the page.</p>
                            )}
                            {teamUsersStatus === "succeeded" && (
                                <div className="space-y-2">
                                    {teamUsers.length === 0
                                        ? <p className="text-sm text-slate-400 italic">No team members found</p>
                                        : teamUsers.map(user => (
                                            <SelectableUserRow
                                                key={user.id}
                                                user={user}
                                                selected={assignees.includes(user.id)}
                                                onToggle={() => toggleAssignee(user.id)}
                                            />
                                        ))
                                    }
                                </div>
                            )}

                        </div>
                    )}

                    {activeTab === "dependencies" && (
                        <div className="px-6 py-5 space-y-5">
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Select tasks this task depends on. This replaces the current dependencies.
                            </p>

                            <SelectedBadges ids={dependencies} resolveLabel={resolveTaskName} onRemove={toggleDependency} />

                            <div className="space-y-2">
                                {tasks.filter(t => t.id !== editingTask?.id).length === 0
                                    ? <p className="text-sm text-slate-400 italic">No other tasks in this project</p>
                                    : tasks
                                        .filter(t => t.id !== editingTask?.id)
                                        .map(task => (
                                            <SelectableTaskRow
                                                key={task.id}
                                                task={task}
                                                selected={dependencies.includes(task.id)}
                                                onToggle={() => toggleDependency(task.id)}
                                            />
                                        ))
                                }
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
                    <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>

                    {activeTab === "basic" && (
                        <Button form="task-form" type="submit" className="flex-1 gap-2"
                            disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
                            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {isEdit ? "Update Task" : "Create Task"}
                        </Button>
                    )}
                    {activeTab === "assignees" && (
                        <Button className="flex-1 gap-2" onClick={handleSaveAssignees} disabled={assigneeSaving}>
                            {assigneeSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Save Assignees
                        </Button>
                    )}
                    {activeTab === "dependencies" && (
                        <Button className="flex-1 gap-2" onClick={handleSaveDependencies} disabled={depSaving}>
                            {depSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Save Dependencies
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}
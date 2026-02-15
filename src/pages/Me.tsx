import { useEffect, useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"
import { fetchTaskForUser } from "../api/me.api"
import { ArrowUp, Calendar, CheckCircle2, Flame } from "lucide-react"

type Task = {
    id: string
    name: string
    priority: number
    end: string
    status: string
    assignees: string[]
    feature?: { name: string }
}

export default function Me() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)

    // 🔹 Fetch tasks from backend
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchTaskForUser()
                setTasks(data)
            } catch (err) {
                console.error("Failed to fetch user tasks", err)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    // 🔹 Placeholder – you will implement backend integration
    const onComplete = (taskId: string) => {
        console.log("Complete task:", taskId)
    }

    const today = new Date()

    const classifyTask = (task: Task) => {
        const due = new Date(task.end)
        const daysLeft =
            (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)

        const urgent = daysLeft <= 3
        const important = task.priority >= 4

        if (urgent && important) return "do"
        if (!urgent && important) return "schedule"
        if (urgent && !important) return "delegate"
        return "eliminate"
    }

    const quadrants = useMemo(() => {
        const buckets = {
            do: [] as Task[],
            schedule: [] as Task[],
            delegate: [] as Task[],
            eliminate: [] as Task[],
        }

        tasks.forEach(task => {
            const bucket = classifyTask(task)
            buckets[bucket].push(task)
        })

        return buckets
    }, [tasks])

    if (loading) {
        return <div className="p-6">Loading tasks...</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    My Tasks – Eisenhower Matrix
                </h1>
                <p className="text-sm text-muted-foreground">
                    Prioritized by urgency (due date) and importance (priority).
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <QuadrantCard
                    title="Do First"
                    description="Urgent & Important"
                    tasks={quadrants.do}
                    onComplete={onComplete}
                />
                <QuadrantCard
                    title="Schedule"
                    description="Not Urgent but Important"
                    tasks={quadrants.schedule}
                    onComplete={onComplete}
                />
                <QuadrantCard
                    title="Delegate"
                    description="Urgent but Not Important"
                    tasks={quadrants.delegate}
                    onComplete={onComplete}
                />
                <QuadrantCard
                    title="Eliminate"
                    description="Not Urgent & Not Important"
                    tasks={quadrants.eliminate}
                    onComplete={onComplete}
                />
            </div>
        </div>
    )
}

function QuadrantCard({
    title,
    description,
    tasks,
    onComplete,
}: {
    title: string
    description: string
    tasks: Task[]
    onComplete: (id: string) => void
}) {
    const today = new Date()

    const getMeta = (task: Task) => {
        const due = new Date(task.end)
        const daysLeft =
            (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)

        return {
            urgent: daysLeft <= 3,
            important: task.priority >= 4,
            daysLeft: Math.ceil(daysLeft),
        }
    }

    return (
        <Card className="flex flex-col bg-card shadow-sm">
            <CardHeader className="px-4 py-3">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-sm font-semibold">
                            {title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    <Badge variant="secondary" className="text-xs rounded-full">
                        {tasks.length}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="px-4 pb-4">
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {tasks.length === 0 && (
                        <div className="text-xs text-muted-foreground py-6 text-center">
                            Nothing here
                        </div>
                    )}

                    {tasks.map(task => {
                        const meta = getMeta(task)

                        return (
                            <div
                                key={task.id}
                                className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition text-sm"
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="space-y-1">
                                        <p className="font-medium">
                                            {task.name}
                                        </p>

                                        {/* Meta row */}
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {meta.daysLeft}d
                                            </div>

                                            {meta.urgent && (
                                                <div className="flex items-center gap-1">
                                                    <Flame size={14} />
                                                </div>
                                            )}

                                            {meta.important && (
                                                <div className="flex items-center gap-1">
                                                    <ArrowUp size={14} />
                                                </div>
                                            )}

                                            {task.feature && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px]"
                                                >
                                                    {task.feature.name}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8"
                                        onClick={() => onComplete(task.id)}
                                    >
                                        <CheckCircle2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}



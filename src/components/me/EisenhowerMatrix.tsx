import type { Task } from "../../types/task"
import { TaskCard } from "./TaskCard"
import { Badge } from "../ui/badge"
import { Card, CardHeader, CardTitle } from "../ui/card"

interface QuadrantProps {
    title: string
    tasks: Task[]
    description: string
    colorClass: string
    onComplete: (id: string) => void
}

const Quadrant = ({ title, tasks, description, colorClass, onComplete }: QuadrantProps) => (
    <Card className={`${colorClass} flex flex-col overflow-hidden shadow-sm`}>
        {/* title and description with number */}
        <CardHeader className="bg-white mx-1 py-2 rounded-2xl flex justify-between items-center">
            <div>
                <CardTitle className="text-sm font-bold tracking-tight">{title}</CardTitle>
                <p className="text-[11px] text-slate-500 mt-1">{description}</p>
            </div>

            <Badge className="text-xs">{tasks.length}</Badge>
        </CardHeader>

        {/* task-grid */}
        <div className="px-4 flex-1 max-h-60 overflow-auto">
            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 opacity-40">
                    <p className="text-xs font-medium italic">Clear for now</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onComplete={onComplete}
                        />
                    ))}
                </div>
            )}
        </div>
    </Card>
)

export const EisenhowerMatrix = ({ tasks, onComplete }: { tasks: Record<string, Task[]>, onComplete: (id: string) => void }) => {
    return (
        <div className="mt-2 grid md:grid-cols-2 gap-4">
            <Quadrant
                title="Do First"
                tasks={tasks.do}
                description="Urgent & Important"
                colorClass="bg-red-200/70"
                onComplete={onComplete}
            />
            <Quadrant
                title="Schedule"
                tasks={tasks.schedule}
                description="Not Urgent & Important"
                colorClass="bg-sky-200/70"
                onComplete={onComplete}
            />
            <Quadrant
                title="Delegate"
                tasks={tasks.delegate}
                description="Urgent & Low Importance"
                colorClass="bg-amber-200/70"
                onComplete={onComplete}
            />
            <Quadrant
                title="Eliminate"
                tasks={tasks.eliminate}
                description="Low Priority"
                colorClass="bg-green-200/70"
                onComplete={onComplete}
            />
        </div>
    )
}
import type { Task } from "@/types/task"
import { Calendar, CheckCircle2, ArrowUpCircle, PlayCircle, CheckSquare, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/util/helper"
import { URGENT_PRIORITY } from "@/pages/Me"

interface TaskCardProps {
    task: Task
    onComplete: (id: string) => void
}

export const TaskCard = ({ task, onComplete, }: TaskCardProps) => {

    return (
        <div className={cn(
            "group relative flex flex-col gap-3 p-4 mb-1 rounded-xl border border-slate-200 bg-white hover:border-violet-200 hover:shadow-md transition-all duration-200",
        )}>
            {/* header: name & status, complete */}
            <div className="flex items-start justify-between gap-3">

                {/* status, feature and name */}
                <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider h-4 px-1.5 bg-slate-50 font-bold">
                            {task.status || "Todo"}
                        </Badge>

                        {task.feature && (
                            <div className="flex items-center gap-1 text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                <Tag className="h-2.5 w-2.5" />
                                {task.feature.name}
                            </div>
                        )}
                    </div>

                    {/* name */}
                    <h3 className="font-bold text-slate-900 truncate text-sm leading-none pt-1">
                        {task.name}
                    </h3>
                </div>

                {/* complete button */}
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 shrink-0 transition-all"
                    onClick={() => onComplete(task.id)}
                >
                    <CheckCircle2 className="h-5 w-5" />
                </Button>
            </div>

            {/* timeline section */}
            <div className="grid grid-cols-2 gap-y-2 text-[10px] text-slate-500">

                {/* start and end */}
                <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-medium uppercase text-[11px]">Plan</span>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>{formatDate(task.start) || '—'} → {formatDate(task.end) || '—'}</span>
                    </div>
                </div>

                {/* started and completed. */}
                <div className="flex flex-col gap-1 border-l pl-3">
                    <span className="text-slate-400 font-medium uppercase text-[11px]">Actual</span>
                    <div className="space-y-0.5">
                        {task.startedAt && (
                            <div className="flex items-center gap-1.5 text-blue-600">
                                <PlayCircle className="h-3 w-3" />
                                <span>{formatDate(task.startedAt)}</span>
                            </div>
                        )}
                        {task.completedAt && (
                            <div className="flex items-center gap-1.5 text-emerald-600">
                                <CheckSquare className="h-3 w-3" />
                                <span>{formatDate(task.completedAt)}</span>
                            </div>
                        )}
                        {!task.startedAt && !task.completedAt && <span className="text-slate-300">Not started</span>}
                    </div>
                </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* footer: priority and assignee */}
            <div className="flex items-center justify-end">
                {/* priority */}
                <div className="flex items-center gap-2">
                    {task.priority && (
                        <div className={cn(
                            "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold",
                            task.priority >= URGENT_PRIORITY ? "text-rose-600 bg-rose-50" : "text-slate-600 bg-slate-100"
                        )}>
                            <ArrowUpCircle className="h-3 w-3" />
                            P{task.priority}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
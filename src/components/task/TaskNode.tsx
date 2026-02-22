import { Handle, Position } from "reactflow"
import type { Status } from "../../types/task"
import { BoxIcon, CheckIcon, CloudLightningIcon, LockIcon, TimerIcon } from "lucide-react"

const STATUS_STYLES: Record<string, {
    ring: string
    bg: string
    glow: string
    dot: string
    label: string
    pulse?: boolean
}> = {
    LOCKED: {
        ring: "ring-slate-300",
        bg: "bg-gradient-to-br from-slate-100 to-slate-200",
        glow: "shadow-slate-200",
        dot: "bg-slate-400",
        label: "text-slate-500",
    },
    PENDING: {
        ring: "ring-amber-300",
        bg: "bg-gradient-to-br from-amber-50 to-orange-100",
        glow: "shadow-amber-200",
        dot: "bg-amber-400",
        label: "text-amber-700",
        pulse: true,
    },
    ACTIVE: {
        ring: "ring-blue-400",
        bg: "bg-gradient-to-br from-blue-50 to-indigo-100",
        glow: "shadow-blue-300",
        dot: "bg-blue-500",
        label: "text-blue-700",
        pulse: true,
    },
    COMPLETED: {
        ring: "ring-emerald-400",
        bg: "bg-gradient-to-br from-emerald-50 to-teal-100",
        glow: "shadow-emerald-200",
        dot: "bg-emerald-500",
        label: "text-emerald-700",
    },
    ARCHIVED: {
        ring: "ring-slate-200",
        bg: "bg-gradient-to-br from-slate-50 to-slate-100",
        glow: "shadow-slate-100",
        dot: "bg-slate-300",
        label: "text-slate-400",
    },
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
    LOCKED: <LockIcon />,
    PENDING: <TimerIcon />,
    ACTIVE: <CloudLightningIcon />,
    COMPLETED: <CheckIcon />,
    ARCHIVED: <BoxIcon />,
}

export default function TaskNode({ data }: { data: { label: string, status: Status } }) {
    const status = data.status ?? "PENDING"
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING

    return (
        <div className="relative flex flex-col items-center group">
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: "transparent",
                    border: "none",
                    width: 8,
                    height: 8,
                    left: -4,
                }}
            />

            {/* outer glow ring */}
            <div
                className={`
                    absolute inset-0 rounded-full opacity-40 
                    transition-opacity duration-500 group-hover:opacity-70
                    ${style.glow}
                `}
                style={{ background: "inherit" }}
            />

            {/* node circle */}
            <div
                className={`
                    relative w-27.5 h-27.5 rounded-full
                    ring-2 ${style.ring} ${style.bg}
                    shadow-lg ${style.glow}
                    flex flex-col items-center justify-center gap-1
                    transition-all duration-300
                    group-hover:scale-110 group-hover:ring-[3px]
                    cursor-pointer select-none
                `}
            >

                {/* status icon */}
                <span className="text-lg leading-none">{STATUS_ICONS[status]}</span>

                {/* task name */}
                <p
                    className="text-[10px] font-bold text-center text-slate-700 leading-tight px-2 max-w-full"
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {data.label}
                </p>

                {/* status dot */}
                <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    <span className={`text-[8px] font-semibold uppercase tracking-wide ${style.label}`}>
                        {status}
                    </span>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                style={{
                    background: "transparent",
                    border: "none",
                    width: 8,
                    height: 8,
                    right: -4,
                }}
            />
        </div>
    )
}
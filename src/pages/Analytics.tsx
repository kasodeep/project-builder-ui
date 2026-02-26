import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchProjectAnalytics } from "@/api/analytics.api"
import type { DashboardAnalyticsDto } from "@/types/analytics"
import { Spinner } from "@/components/ui/spinner"
import {
    AlertCircle, Activity, GitBranch, Users, Heart,
    TrendingUp, Clock, Zap, BarChart3, RefreshCw, Link2, Timer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function riskColor(level: string) {
    switch (level) {
        case "GREEN": return "text-emerald-600 bg-emerald-50 border-emerald-200"
        case "AMBER": return "text-amber-600 bg-amber-50 border-amber-200"
        case "RED":   return "text-red-600 bg-red-50 border-red-200"
        default:      return "text-slate-600 bg-slate-50 border-slate-200"
    }
}

const GRADE_META: Record<string, { color: string; bg: string; ring: string; label: string }> = {
    A: { color: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-300", label: "Excellent" },
    B: { color: "text-teal-700",    bg: "bg-teal-50",    ring: "ring-teal-300",    label: "Good"      },
    C: { color: "text-amber-700",   bg: "bg-amber-50",   ring: "ring-amber-300",   label: "Fair"      },
    D: { color: "text-orange-700",  bg: "bg-orange-50",  ring: "ring-orange-300",  label: "Poor"      },
    F: { color: "text-red-700",     bg: "bg-red-50",     ring: "ring-red-300",     label: "Critical"  },
}

function GradeBadge({ grade }: { grade: string }) {
    const meta = GRADE_META[grade] ?? GRADE_META["F"]
    return (
        <div className={cn(
            "h-20 w-20 rounded-2xl ring-4 flex flex-col items-center justify-center shrink-0",
            meta.bg, meta.ring
        )}>
            <span className={cn("text-4xl font-black leading-none", meta.color)}>{grade}</span>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider mt-0.5", meta.color)}>
                {meta.label}
            </span>
        </div>
    )
}

function ScoreRing({ score, max = 100, label }: { score: number; max?: number; label: string }) {
    const pct = Math.min((score / max) * 100, 100)
    const radius = 28
    const circumference = 2 * Math.PI * radius
    const dash = (pct / 100) * circumference
    const ringColor = pct >= 70 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444"
    const textColor = pct >= 70 ? "text-emerald-600" : pct >= 40 ? "text-amber-600" : "text-red-600"

    return (
        <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="relative h-20 w-20">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
                    <circle cx="36" cy="36" r={radius} fill="none" stroke={ringColor} strokeWidth="6"
                        strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.6s ease" }} />
                </svg>
                <span className={cn("absolute inset-0 flex items-center justify-center text-lg font-bold", textColor)}>
                    {Math.round(score)}
                </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        </div>
    )
}

function StatCard({ label, value, unit, icon: Icon, description, highlight }: {
    label: string; value: number | string; unit?: string
    icon: React.ElementType; description?: string
    highlight?: "good" | "warn" | "bad" | "neutral"
}) {
    const wrapClass =
        highlight === "good" ? "border-emerald-200 bg-emerald-50/40" :
        highlight === "warn" ? "border-amber-200 bg-amber-50/40"     :
        highlight === "bad"  ? "border-red-200 bg-red-50/40"         :
                               "border-slate-200 bg-white"
    const iconClass =
        highlight === "good" ? "bg-emerald-100 text-emerald-600" :
        highlight === "warn" ? "bg-amber-100 text-amber-600"     :
        highlight === "bad"  ? "bg-red-100 text-red-600"         :
                               "bg-slate-100 text-slate-600"

    return (
        <div className={cn("rounded-xl border p-4 flex flex-col gap-3 shadow-sm", wrapClass)}>
            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", iconClass)}>
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-900 leading-none">
                    {value}
                    {unit && <span className="text-sm font-medium text-slate-400 ml-1">{unit}</span>}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
                {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
            </div>
        </div>
    )
}

function SectionHeader({ icon: Icon, title, subtitle }: {
    icon: React.ElementType; title: string; subtitle?: string
}) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Icon className="h-4 w-4 text-violet-600" />
            </div>
            <div>
                <h2 className="text-base font-bold text-slate-900">{title}</h2>
                {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
        </div>
    )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function HealthSection({ health }: { health: DashboardAnalyticsDto["health"] }) {
    return (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionHeader icon={Heart} title="Project Health"
                subtitle="Grade based on overdue, blocked, and stale tasks" />
            <div className="flex items-center gap-5 mb-6">
                <GradeBadge grade={health.healthGrade} />
                <div className="flex-1">
                    <span className={cn(
                        "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border",
                        riskColor(health.riskLevel)
                    )}>
                        {health.riskLevel === "GREEN" ? "Low Risk"
                            : health.riskLevel === "AMBER" ? "Moderate Risk"
                            : "High Risk"}
                    </span>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        {health.healthGrade === "A" ? "No issues detected. Project is on track."       :
                         health.healthGrade === "B" ? "Minor issues present. Worth monitoring."        :
                         health.healthGrade === "C" ? "Some tasks need attention."                     :
                         health.healthGrade === "D" ? "Multiple risk factors. Prioritise review."      :
                                                      "Critical state. Immediate action required."}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <StatCard label="Overdue" value={health.overdueTasks} icon={Clock}
                    highlight={health.overdueTasks === 0 ? "good" : health.overdueTasks <= 3 ? "warn" : "bad"}
                    description="Past due date" />
                <StatCard label="Blocked" value={health.blockedTasks} icon={AlertCircle}
                    highlight={health.blockedTasks === 0 ? "good" : health.blockedTasks <= 2 ? "warn" : "bad"}
                    description="Waiting on deps" />
                <StatCard label="Long-running" value={health.longRunningTasks} icon={Timer}
                    highlight={health.longRunningTasks === 0 ? "good" : health.longRunningTasks <= 2 ? "warn" : "bad"}
                    description="Active > 14 days" />
            </div>
        </section>
    )
}

function FlowSection({ flow }: { flow: DashboardAnalyticsDto["flow"] }) {
    return (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionHeader icon={Activity} title="Work Flow" subtitle="Task throughput and cycle metrics" />
            <div className="grid grid-cols-2 gap-3">
                <StatCard label="WIP Tasks" value={flow.wipCount} icon={Zap}
                    highlight={flow.wipCount <= 5 ? "good" : flow.wipCount <= 10 ? "warn" : "bad"}
                    description="Currently in progress" />
                <StatCard label="Avg Cycle Time" value={flow.avgCycleTime?.toFixed(1) ?? "—"} unit="days"
                    icon={Clock}
                    highlight={flow.avgCycleTime <= 3 ? "good" : flow.avgCycleTime <= 7 ? "warn" : "bad"}
                    description="Start to completion" />
                <StatCard label="7-day Throughput" value={flow.throughput7d} icon={TrendingUp}
                    highlight={flow.throughput7d >= 5 ? "good" : flow.throughput7d >= 2 ? "warn" : "bad"}
                    description="Completed this week" />
                <StatCard label="30-day Throughput" value={flow.throughput30d} icon={BarChart3}
                    highlight="neutral" description="Completed this month" />
            </div>
        </section>
    )
}

function DependencySection({ dep }: { dep: DashboardAnalyticsDto["dependency"] }) {
    return (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionHeader icon={GitBranch} title="Dependency Risk"
                subtitle="Normalised against max possible edges" />
            <div className="flex items-center gap-5 mb-6">
                <ScoreRing score={dep.riskScore} label="Risk Score" />
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Normalised Density</span>
                        <span className="font-semibold text-slate-800">{dep.dependencyDensity?.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-700",
                            dep.dependencyDensity <= 0.3 ? "bg-emerald-500" :
                            dep.dependencyDensity <= 0.6 ? "bg-amber-500" : "bg-red-500"
                        )} style={{ width: `${Math.min(dep.dependencyDensity * 100, 100)}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {dep.dependencyDensity <= 0.3 ? "Low coupling — healthy structure" :
                         dep.dependencyDensity <= 0.6 ? "Moderate coupling — monitor closely" :
                                                        "High coupling — consider refactoring"}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <StatCard label="Total Deps" value={dep.totalDependencies} icon={Link2}
                    highlight="neutral" description="Edges in graph" />
                <StatCard label="Blocked Deps" value={dep.blockedDependencyCount} icon={AlertCircle}
                    highlight={dep.blockedDependencyCount === 0 ? "good" : dep.blockedDependencyCount <= 2 ? "warn" : "bad"}
                    description="Upstream not done" />
                <StatCard label="Critical Path" value={dep.criticalPathLength} unit="hops" icon={GitBranch}
                    highlight={dep.criticalPathLength <= 3 ? "good" : dep.criticalPathLength <= 6 ? "warn" : "bad"}
                    description="Longest chain" />
            </div>
        </section>
    )
}

function TeamSection({ team }: { team: DashboardAnalyticsDto["team"] }) {
    return (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <SectionHeader icon={Users} title="Team Capacity"
                subtitle="Team-wide stats — across all projects, not just this one" />
            <div className="flex items-center gap-5 mb-6">
                <ScoreRing score={team.burnoutRiskScore} label="Burnout Risk" />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">
                        {team.overloadedUsers} overloaded {team.overloadedUsers === 1 ? "member" : "members"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        {team.avgTasksPerUser?.toFixed(1)} avg tasks per person
                        across {team.activeProjects} active {team.activeProjects === 1 ? "project" : "projects"}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <StatCard label="Active Tasks" value={team.activeTasks} icon={Activity}
                    highlight="neutral" description="In flight team-wide" />
                <StatCard label="Avg Tasks / User" value={team.avgTasksPerUser?.toFixed(1) ?? "—"} icon={Users}
                    highlight={team.avgTasksPerUser <= 5 ? "good" : team.avgTasksPerUser <= 8 ? "warn" : "bad"}
                    description="Current team load" />
                <StatCard label="Avg Completion" value={team.avgCompletionTimeDays?.toFixed(1) ?? "—"} unit="days"
                    icon={Clock}
                    highlight={team.avgCompletionTimeDays <= 3 ? "good" : team.avgCompletionTimeDays <= 7 ? "warn" : "bad"}
                    description="Time to close a task" />
                <StatCard label="Overloaded Members" value={team.overloadedUsers} icon={AlertCircle}
                    highlight={team.overloadedUsers === 0 ? "good" : team.overloadedUsers <= 2 ? "warn" : "bad"}
                    description="Above capacity threshold" />
            </div>
        </section>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Analytics() {
    const { projectId } = useParams()
    const [data, setData]       = useState<DashboardAnalyticsDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState<string | null>(null)

    const load = () => {
        if (!projectId) return
        setLoading(true)
        setError(null)
        fetchProjectAnalytics(projectId)
            .then(setData)
            .catch(() => setError("Failed to load analytics data."))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [projectId])

    return (
        <div className="space-y-6 pb-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Project Analytics</h1>
                    <p className="text-slate-500 font-medium text-sm mt-0.5">
                        Health, flow, dependencies and team capacity at a glance.
                    </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={load} disabled={loading}>
                    <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                    Refresh
                </Button>
            </header>

            {loading && (
                <div className="flex items-center justify-center py-24">
                    <Spinner className="h-10 w-10" />
                </div>
            )}

            {error && !loading && (
                <div className="flex flex-col items-center gap-3 py-24 text-center">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                    <p className="text-sm font-medium text-slate-700">{error}</p>
                    <Button variant="outline" size="sm" onClick={load} className="gap-2 mt-1">
                        <RefreshCw className="h-3.5 w-3.5" /> Try again
                    </Button>
                </div>
            )}

            {data && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <HealthSection     health={data.health}     />
                    <FlowSection       flow={data.flow}         />
                    <DependencySection dep={data.dependency}    />
                    <TeamSection       team={data.team}         />
                </div>
            )}
        </div>
    )
}
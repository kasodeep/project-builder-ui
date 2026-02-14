import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState, AppDispatch } from "../store"
import { fetchProjects } from "../store/project.slice"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Skeleton } from "../components/ui/skeleton"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import { Activity, ArrowUpRight, Calendar, Pencil } from "lucide-react"
import { Separator } from "../components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"
import { Avatar, AvatarFallback } from "../components/ui/avatar"

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString)
    const diff = Date.now() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
}

const ProjectList = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { projects, status } = useSelector((s: RootState) => s.project)

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchProjects())
        }
    }, [status, dispatch])

    if (status === "loading") {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="space-y-4 p-4">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-24" />
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4 px-2">
            {/* Page description. */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        Projects
                    </h1>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                    <Card
                        key={p.id}
                        className="relative flex flex-col border-slate-200 bg-card hover:shadow-2xl transition-all duration-300 group"
                    >
                        <CardHeader className="px-5">
                            <div className="flex justify-between items-start">
                                <Badge>
                                    {p.team?.name || "No Team"}
                                </Badge>
                            </div>

                            <CardTitle className="text-xl font-bold tracking-tight text-slate-900 mt-3">
                                {p.name}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-6 pb-6 space-y-4">
                            {/* Progress Section with Icon */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Activity className="h-4 w-4" />
                                        <span>Completion</span>
                                    </div>
                                    <span className="font-bold tabular-nums text-slate-900">{p.progress}%</span>
                                </div>
                                <Progress value={p.progress} className="h-2 bg-slate-100" />
                            </div>

                            <Separator className="bg-slate-100" />

                            {/* Metadata with Avatars and Icons */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Avatar className="h-8 w-8 border border-white shadow-sm">
                                                    <AvatarFallback className="bg-slate-200 text-[10px] font-bold">
                                                        {p.owner.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Owner: {p.owner}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Owner</span>
                                        <span className="text-sm font-medium text-slate-700">{p.owner}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Calendar className="h-3 w-3" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Updated</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{formatRelativeTime(p.updatedAt)}</span>
                                </div>
                            </div>

                            {/* Action Button Section */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    variant="default"
                                    className="flex-1 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all duration-300 font-semibold group/btn"
                                    onClick={() => navigate(`/dashboard/${p.id}`)}
                                >
                                    View Workspace
                                    <ArrowUpRight className="ml-2 h-4 w-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                    onClick={() => { /* Edit Logic */ }}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default ProjectList

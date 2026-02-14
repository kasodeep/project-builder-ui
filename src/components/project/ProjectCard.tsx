import { useNavigate } from "react-router-dom"
import type { Project } from "../../types/project"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Badge } from "../ui/badge"
import { Activity, ArrowUpRight, Calendar, Pencil } from "lucide-react"
import { Separator } from "../ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Avatar, AvatarFallback } from "../ui/avatar"

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString)
    const diff = Date.now() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
}

interface ProjectCardProps {
    project: Project
    onEdit: (project: Project) => void
}

const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
    const navigate = useNavigate()

    return (
        <Card className="relative flex flex-col border-slate-200 bg-card hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="px-5">
                <div className="flex justify-between items-start">
                    <Badge>
                        {project.team?.name || "No Team"}
                    </Badge>
                </div>

                <CardTitle className="text-xl font-bold tracking-tight text-slate-900 mt-3">
                    {project.name}
                </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6 space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Activity className="h-4 w-4" />
                            <span>Completion</span>
                        </div>
                        <span className="font-bold tabular-nums text-slate-900">
                            {project.progress}%
                        </span>
                    </div>
                    <Progress value={project.progress} className="h-2 bg-slate-100" />
                </div>

                <Separator className="bg-slate-100" />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Avatar className="h-8 w-8 border border-white shadow-sm">
                                        <AvatarFallback className="bg-slate-200 text-[10px] font-bold">
                                            {project.owner.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Owner: {project.owner}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Owner
                            </span>
                            <span className="text-sm font-medium text-slate-700">
                                {project.owner}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <Calendar className="h-3 w-3" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                Updated
                            </span>
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                            {formatRelativeTime(project.updatedAt)}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button
                        className="flex-1 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-semibold group/btn"
                        onClick={() => navigate(`/dashboard/${project.id}`)}
                    >
                        View Workspace
                        <ArrowUpRight className="ml-2 h-4 w-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-slate-200 hover:bg-slate-50"
                        onClick={() => onEdit(project)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectCard

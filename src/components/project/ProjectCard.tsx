import { useNavigate } from "react-router-dom"
import type { Project } from "@/types/project"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Pencil, Users, ArrowRight, Clock, BarChart3 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDate } from "@/util/helper"

const getStatusDetails = (progress: number) => {
    if (progress === 100) return { label: "Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" }
    if (progress > 0) return { label: "In Progress" }
    return { label: "Planned", color: "bg-slate-50 text-slate-600 border-slate-200" }
}

interface ProjectCardProps {
    project: Project
    onEdit: (project: Project) => void
}

const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
    const navigate = useNavigate()
    const status = getStatusDetails(project.progress)

    return (
        <Card className="group relative flex flex-col border-slate-200 bg-card hover:shadow-2xl transition-all duration-300 group">

            {/* card-header */}
            <CardHeader>
                {/* status for the projects. */}
                <div className="flex justify-between items-center mb-3">
                    <Badge className={`${status.color} tracking-wider`}>
                        {status.label}
                    </Badge>

                    {/* edit button for project. */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-violet-600 hover:bg-violet-50 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {/* name of the project */}
                <CardTitle className="text-lg font-bold leading-tight">
                    {project.name}
                </CardTitle>

                {/* team and last update date. */}
                <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {project.team?.name || "Independent"}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-slate-500 font-medium">
                        <Clock className="h-3 w-3" />
                        {formatDate(project.updatedAt)}
                    </div>
                </div>

            </CardHeader>

            <CardContent className="space-y-4">
                {/* timeline with start and end, */}
                <div className="flex items-center justify-between text-[12px] text-slate-500 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{new Date(project.start).toLocaleDateString()}</span>
                    </div>

                    <ArrowRight className="h-3 w-3" />

                    <span className="font-medium text-slate-700">
                        {new Date(project.end).toLocaleDateString()}
                    </span>
                </div>

                {/* progress bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                        <span>Completion</span>
                        <Badge>{project.progress}%</Badge>
                    </div>
                    <Progress value={project.progress} className="h-1.5 bg-slate-100" />
                </div>

                {/* managers, owner and footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        {/* managers avatar */}
                        <div className="flex -space-x-2">
                            {project.managers.slice(0, 3).map((m, i) => (
                                <TooltipProvider key={i}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Avatar className="h-7 w-7 border-2 border-white ring-1 ring-slate-100">
                                                <AvatarFallback className="bg-slate-100 text-[10px] font-bold text-slate-600">
                                                    {m.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent><p className="text-xs">{m}</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>

                        {/* owner */}
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Owner</span>
                            <span className="text-xs font-semibold text-slate-700">{project.owner}</span>
                        </div>
                    </div>

                    {/* navigation buttons */}
                    <div className="flex items-center gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="font-bold text-xs h-8 px-3 rounded-md transition-colors text-slate-500 hover:text-violet-600 hover:bg-violet-50"
                                        onClick={() => navigate(`/analytics/${project.id}`)}
                                    >
                                        <BarChart3 className="h-3.5 w-3.5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p className="text-xs">Analytics</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Button
                            size="sm"
                            variant="ghost"
                            className="font-bold text-xs h-8 px-3 rounded-md transition-colors"
                            onClick={() => navigate(`/dashboard/${project.id}`)}
                        >
                            Dashboard
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectCard
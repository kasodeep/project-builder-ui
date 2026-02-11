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
        <div className="space-y-3">

            <div>
                <h1 className="text-2xl font-semibold text-slate-800">
                    Projects
                </h1>
                <p className="text-sm text-slate-500">
                    Overview of all active projects
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                    <Card
                        key={p.id}
                        className="group relative rounded-2xl border border-slate-400 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <CardHeader className="space-y-3 pt-1">
                            <CardTitle className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                                {p.name}
                            </CardTitle>

                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>Team: {p.team?.name}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-5">

                            {/* Progress Section */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Progress</span>
                                    <Badge className="font-medium">
                                        {p.progress}%
                                    </Badge>
                                </div>
                                <Progress value={p.progress} />
                            </div>

                            {/* Metadata */}
                            <div className="text-xs text-slate-500 space-y-3 border-t pt-3">

                                <div className="flex justify-between">
                                    <span className="text-slate-400">Owner</span>
                                    <span className="font-medium text-slate-700">
                                        {p.owner}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-400">Timeline</span>
                                    <span className="font-medium text-slate-700">
                                        {new Date(p.start).toLocaleDateString()} –{" "}
                                        {new Date(p.end).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-400">Last Updated</span>
                                    <span className="font-medium text-slate-700">
                                        {formatRelativeTime(p.updatedAt)}
                                    </span>
                                </div>

                            </div>

                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                                onClick={() => navigate(`/dashboard/${p.id}`)}
                            >
                                Open Dashboard
                            </Button>

                        </CardContent>
                    </Card>

                ))}
            </div>
        </div>
    )
}

export default ProjectList

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store"
import {
    fetchProjects,
    openCreateSidebar,
    openEditSidebar
} from "../store/project.slice"

import { Button } from "../components/ui/button"
import { Skeleton } from "../components/ui/skeleton"
import ProjectList from "../components/project/ProjectList"
import ProjectSidebar from "../components/project/ProjectSidebar"

const ProjectPage = () => {
    const dispatch = useDispatch<AppDispatch>()
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
                    <Skeleton key={i} className="h-40 w-full" />
                ))}
            </div>
        )
    }

    return (
        <div className="px-2">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Projects
                </h1>

                <Button onClick={() => dispatch(openCreateSidebar())}>
                    New Project
                </Button>
            </div>

            <ProjectList
                projects={projects}
                onEdit={(p) => dispatch(openEditSidebar(p))}
            />

            <ProjectSidebar />
        </div>
    )
}

export default ProjectPage

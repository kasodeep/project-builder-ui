import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../store"
import {
    fetchProjects,
    openCreateSidebar,
    openEditSidebar
} from "../store/project.slice"

import { Button } from "../components/ui/button"
import ProjectList from "../components/project/ProjectList"
import ProjectSidebar from "../components/project/ProjectSidebar"
import ProjectCardSkeleton from "../components/project/ProjectCardSkeleton"

const ProjectPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { projects, status } = useSelector((s: RootState) => s.project)

    // fetching the projects by team.
    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchProjects())
        }
    }, [status, dispatch])

    return (
        <div className="px-2">
            {/* Header stays visible even during loading */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Projects
                </h1>
                <Button onClick={() => dispatch(openCreateSidebar())}>
                    New Project
                </Button>
            </div>

            {status === "loading" ? (
                <ProjectCardSkeleton />
            ) : (
                <ProjectList
                    projects={projects}
                    onEdit={(p) => dispatch(openEditSidebar(p))}
                />
            )}

            <ProjectSidebar />
        </div>
    )
}

export default ProjectPage

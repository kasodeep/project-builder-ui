import type { Project } from "../../types/project"
import ProjectCard from "./ProjectCard"

interface Props {
    projects: Project[]
    onEdit: (project: Project) => void
}

const ProjectList = ({ projects, onEdit }: Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
                <ProjectCard
                    key={p.id}
                    project={p}
                    onEdit={onEdit}
                />
            ))}
        </div>
    )
}

export default ProjectList

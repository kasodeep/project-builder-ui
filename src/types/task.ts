export type Feature = {
    id: string
    name: string
}

export type Task = {
    id: string
    projectId: string | null
    assignees: string[] | null
    name: string
    feature: Feature
    dependencies: string[]
    priority: number | null
    status: string | null
    start: string | null
    end: string | null
    updatedBy: string | null
    updatedAt: string | null
    startedAt: string | null
    completedAt: string | null
}

export type Feature = {
    id: string
    name: string
}

export const Status = {
    LOCKED: "LOCKED",
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    ARCHIVED: "ARCHIVED"
} as const

export type Status = typeof Status[keyof typeof Status]

export type Task = {
    id: string
    projectId: string | null
    assignees: string[] | null
    name: string
    feature: Feature
    dependencies: string[]
    priority: number | null
    status: Status | null
    start: string | null
    end: string | null
    updatedBy: string | null
    updatedAt: string | null
    startedAt: string | null
    completedAt: string | null
    version: number
}

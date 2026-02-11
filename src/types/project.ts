import type { Team } from "./team"

export interface Project {
    id: string
    name: string
    team: Team
    owner: string
    managers: string[]
    progress: number
    start: string        // ISO date (yyyy-mm-dd)
    end: string          // ISO date (yyyy-mm-dd)
    updatedBy: string
    updatedAt: string    // ISO timestamp
}

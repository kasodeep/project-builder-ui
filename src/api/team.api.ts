import type { Team } from "../types/team"
import publicApi from "./public.axios"

export const fetchAllTeams = async (): Promise<Team[]> => {
    const res = await publicApi.get("/team/all")
    return res.data
}

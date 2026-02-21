import type { Feature } from "../types/task"
import publicApi from "./public.axios"

export const fetchAllFeatures = async (): Promise<Feature[]> => {
    const res = await publicApi.get("/feature/all")
    return res.data
}
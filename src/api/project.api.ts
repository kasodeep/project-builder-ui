import type { CreateProjectInput, UpdateProjectInput } from "@/schema/project.schema"
import secureApi from "./secure.axios"

export const fetchProjectsApi = async () => {
    const res = await secureApi.get("/project")
    return res.data
}

export const createProjectApi = async (data: CreateProjectInput) => {
    const res = await secureApi.post(`/project/create`, data)
    return res.data
}

export const updateProjectApi = async (data: UpdateProjectInput) => {
    const res = await secureApi.patch(
        `/project/update`,
        data
    )
    return res.data
}


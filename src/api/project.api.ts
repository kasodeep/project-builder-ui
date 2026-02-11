import secureApi from "./secure.axios"

export const fetchProjectsApi = async () => {
    const res = await secureApi.get("/project")
    return res.data
}

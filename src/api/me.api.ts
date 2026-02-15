import secureApi from "./secure.axios"

export const fetchTaskForUser = async () => {
    const res = await secureApi.get("/task/user")
    return res.data
}
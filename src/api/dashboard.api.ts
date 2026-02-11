import secureApi from "./secure.axios"

export const fetchDashboardApi = async (projectId: string) => { 
    const res = await secureApi.get(`/analytics/${projectId}`)
    return res.data
}

import secureApi from "./secure.axios"


export const taskCompleteApi = async (taskId: string) => {
    const res = await secureApi.patch(`/task/${taskId}/complete`)
    return res.data
}
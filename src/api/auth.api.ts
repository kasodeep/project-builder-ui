import type { UserRegisterRequest } from "../types/auth"
import type { UserDto } from "../types/user"
import publicApi from "./public.axios"

/**
 * POST /api/v1/auth/login
 */
export const loginApi = async (username: string, password: string) => {
    return publicApi.post("/auth/login", { username, password })
}

/**
 * POST /api/v1/auth/register
 */
export const registerApi = async (payload: UserRegisterRequest) => {
    return publicApi.post("/auth/register", payload)
}

/**
 * GET /api/v1/auth/all/{teamId}
 */
export const fetchUsersByTeam = async (teamId: string): Promise<UserDto[]> => {
    const res = await publicApi.get(`/auth/all/${teamId}`)
    return res.data
}
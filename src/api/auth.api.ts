import axios from "axios"
import type { UserRegisterRequest } from "../types/auth"

const AUTH_BASE = "http://localhost:8080/api/v1/auth"

export const loginApi = async (username: string, password: string) => {
    await axios.post(`${AUTH_BASE}/login`, { username, password })
}

export const registerApi = async (payload: UserRegisterRequest) => {
    await axios.post(`${AUTH_BASE}/register`, payload)
}

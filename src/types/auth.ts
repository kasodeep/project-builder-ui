export type AuthState = {
    isAuthenticated: boolean
    loading: boolean
    error?: string
    userId?: string
    username?: string
    teamId?: string
}

export type UserRegisterRequest = {
    username: string
    email: string
    password: string
    role: string
    teamId: string
}
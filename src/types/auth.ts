export type AuthState = {
    isAuthenticated: boolean
    loading: boolean
    error?: string
    username?: string
}

export type UserRegisterRequest = {
    username: string
    email: string
    password: string
    role: string
    teamId: string
}
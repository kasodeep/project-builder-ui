import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { loginApi, registerApi } from "@/api/auth.api"
import type { AuthState, UserRegisterRequest } from "@/types/auth"

const encodeBasic = (u: string, p: string) => btoa(`${u}:${p}`)

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem("basicAuth"),
    loading: false,
    username: localStorage.getItem("authUser") || undefined,
    userId: localStorage.getItem("authUserId") || undefined,
    teamId: localStorage.getItem("authTeamId") || undefined,
}

export const login = createAsyncThunk(
    "auth/login",
    async (
        { username, password }: { username: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await loginApi(username, password)
            const user = res.data

            localStorage.setItem("basicAuth", encodeBasic(username, password))
            localStorage.setItem("authUser", user.username)
            localStorage.setItem("authUserId", user.id)
            localStorage.setItem("authTeamId", user.teamId)

            return user
        } catch {
            return rejectWithValue("User not authorized")
        }
    }
)

export const register = createAsyncThunk(
    "auth/register",
    async (payload: UserRegisterRequest, { rejectWithValue }) => {
        try {
            const res = await registerApi(payload)
            const user = res.data

            localStorage.setItem("basicAuth", encodeBasic(payload.username, payload.password))
            localStorage.setItem("authUser", user.username)
            localStorage.setItem("authUserId", user.id)
            localStorage.setItem("authTeamId", user.teamId)

            return user
        } catch {
            return rejectWithValue("Registration failed")
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            localStorage.removeItem("basicAuth")
            localStorage.removeItem("authUser")
            localStorage.removeItem("authUserId")
            localStorage.removeItem("authTeamId")
            state.isAuthenticated = false
            state.username = undefined
            state.userId = undefined
            state.teamId = undefined
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (s) => {
                s.loading = true
                s.error = undefined
            })
            .addCase(login.fulfilled, (s, a) => {
                s.loading = false
                s.isAuthenticated = true
                s.username = a.payload.username
                s.userId = a.payload.id
                s.teamId = a.payload.teamId
            })
            .addCase(login.rejected, (s, a) => {
                s.loading = false
                s.error = a.payload as string
            })
            .addCase(register.pending, (s) => {
                s.loading = true
                s.error = undefined
            })
            .addCase(register.fulfilled, (s, a) => {
                s.loading = false
                s.isAuthenticated = true
                s.username = a.payload.username
                s.userId = a.payload.id
                s.teamId = a.payload.teamId
            })
            .addCase(register.rejected, (s, a) => {
                s.loading = false
                s.error = a.payload as string
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
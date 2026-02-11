import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { loginApi, registerApi } from "../api/auth.api";
import type { AuthState, UserRegisterRequest } from "../types/auth";

const encodeBasic = (u: string, p: string) =>
    btoa(`${u}:${p}`)

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem("basicAuth"),
    loading: false,
    username: localStorage.getItem("authUser") || undefined,
}

export const login = createAsyncThunk(
    "auth/login",
    async (
        { username, password }: { username: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            await loginApi(username, password)
            localStorage.setItem("basicAuth", encodeBasic(username, password))
            localStorage.setItem("authUser", username)
            return username
        } catch {
            return rejectWithValue("User not authorized")
        }
    }
)

export const register = createAsyncThunk(
    "auth/register",
    async (
        payload: UserRegisterRequest,
        { rejectWithValue }
    ) => {
        try {
            await registerApi(payload)
            localStorage.setItem(
                "basicAuth",
                encodeBasic(payload.username, payload.password)
            )
            localStorage.setItem("authUser", payload.username)
            return payload.username
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
            state.isAuthenticated = false
            state.username = undefined
        }
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
                s.username = a.payload
            })
            .addCase(login.rejected, (s, a) => {
                s.loading = false
                s.error = a.payload as string
            })
            .addCase(register.fulfilled, (s, a) => {
                s.loading = false
                s.isAuthenticated = true
                s.username = a.payload
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer

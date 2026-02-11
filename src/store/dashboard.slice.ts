import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchDashboardApi } from "../api/dashboard.api"
import type { DashboardAnalytics } from "../types/dashboard"

interface DashboardState {
    data?: DashboardAnalytics
    loading: boolean
    error?: string
}

const initialState: DashboardState = {
    loading: false
}

export const fetchDashboard = createAsyncThunk(
    "dashboard/fetch",
    async (projectId: string, { rejectWithValue }) => {
        try {
            return await fetchDashboardApi(projectId)
        } catch {
            return rejectWithValue("Failed to load dashboard")
        }
    }
)

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        clearDashboard(state) {
            state.data = undefined
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (s) => {
                s.loading = true
                s.error = undefined
            })
            .addCase(fetchDashboard.fulfilled, (s, a) => {
                s.loading = false
                s.data = a.payload
            })
            .addCase(fetchDashboard.rejected, (s, a) => {
                s.loading = false
                s.error = a.payload as string
            })
    }
})

export const { clearDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer

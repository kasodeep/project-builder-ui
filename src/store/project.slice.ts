import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchProjectsApi } from "../api/project.api"
import type { Project } from "../types/project"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface ProjectState {
    projects: Project[]
    status: Status
    error: string | null
}

export const fetchProjects = createAsyncThunk<
    Project[],        // Return type
    void,             // Argument type
    { rejectValue: string }
>(
    "project/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchProjectsApi()
            return data
        } catch (err) {
            return rejectWithValue("Failed to fetch projects")
        }
    }
)

const initialState: ProjectState = {
    projects: [],
    status: "idle",
    error: null
}

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.projects = action.payload
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload ?? "Unknown error"
            })
    }
})

export default projectSlice.reducer


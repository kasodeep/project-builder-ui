import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createProjectApi, fetchProjectsApi, updateProjectApi } from "../api/project.api"
import type { Project } from "../types/project"
import type { CreateProjectInput, UpdateProjectInput } from "../schema/project.schema"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface ProjectState {
    projects: Project[]
    status: Status
    error: string | null
    sidebarOpen: boolean
    editingProject: Project | null
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
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data ?? {
                    status: 500,
                    error: "Unexpected server error"
                }
            )
        }
    }
)

export const createProject = createAsyncThunk<
    void,
    CreateProjectInput
>(
    "project/create",
    async (data, { dispatch }) => {
        await createProjectApi(data)
        dispatch(fetchProjects())
    }
)

export const updateProject = createAsyncThunk<
    void,
    UpdateProjectInput
>(
    "project/update",
    async (data, { dispatch }) => {
        await updateProjectApi(data)
        dispatch(fetchProjects())
    }
)

const initialState: ProjectState = {
    projects: [],
    status: "idle",
    error: null,
    sidebarOpen: false,
    editingProject: null
}

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        openCreateSidebar(state) {
            state.sidebarOpen = true
            state.editingProject = null
        },
        openEditSidebar(state, action) {
            state.sidebarOpen = true
            state.editingProject = action.payload
        },
        closeSidebar(state) {
            state.sidebarOpen = false
            state.editingProject = null
        }
    },
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

export const {
    openCreateSidebar,
    openEditSidebar,
    closeSidebar
} = projectSlice.actions
export default projectSlice.reducer


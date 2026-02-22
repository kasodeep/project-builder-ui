import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createProjectApi, fetchProjectsApi, updateProjectApi } from "../api/project.api"
import type { Project } from "../types/project"
import type { CreateProjectInput, UpdateProjectInput } from "../schema/project.schema"
import { extractErrorMessage } from "../util/error"
import { toast } from "sonner"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface ProjectState {
    projects: Project[]
    status: Status
    error: string | null
    sidebarOpen: boolean
    editingProject: Project | null
}

const initialState: ProjectState = {
    projects: [],
    status: "idle",
    error: null,
    sidebarOpen: false,
    editingProject: null,
}

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const fetchProjects = createAsyncThunk<Project[], void, { rejectValue: string }>(
    "project/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchProjectsApi()
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err))
        }
    }
)

export const createProject = createAsyncThunk<void, CreateProjectInput, { rejectValue: string }>(
    "project/create",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            await createProjectApi(data)
            dispatch(fetchProjects())
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err))
        }
    }
)

export const updateProject = createAsyncThunk<void, UpdateProjectInput, { rejectValue: string }>(
    "project/update",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            await updateProjectApi(data)
            dispatch(fetchProjects())
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err))
        }
    }
)

// ─── Slice ────────────────────────────────────────────────────────────────────
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
        },
    },
    extraReducers: (builder) => {
        builder
            // ── fetchProjects ───────────────────────────────────────────────
            .addCase(fetchProjects.pending, (s) => {
                s.status = "loading"
                s.error = null
            })
            .addCase(fetchProjects.fulfilled, (s, a) => {
                s.status = "succeeded"
                s.projects = a.payload
            })
            .addCase(fetchProjects.rejected, (s, a) => {
                s.status = "failed"
                s.error = a.payload ?? "Failed to load projects"
            })

            // ── createProject ───────────────────────────────────────────────
            .addCase(createProject.fulfilled, (s) => {
                s.sidebarOpen = false
                s.editingProject = null
                toast.success("Project created successfully")
            })
            .addCase(createProject.rejected, (_, a) => {
                toast.error(a.payload ?? "Failed to create project")
            })

            // ── updateProject ───────────────────────────────────────────────
            .addCase(updateProject.fulfilled, (s) => {
                s.sidebarOpen = false
                s.editingProject = null
                toast.success("Project updated successfully")
            })
            .addCase(updateProject.rejected, (_, a) => {
                toast.error(a.payload ?? "Failed to update project")
            })
    },
})

export const { openCreateSidebar, openEditSidebar, closeSidebar } = projectSlice.actions
export default projectSlice.reducer
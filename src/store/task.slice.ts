import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Task, Feature } from "@/types/task"
import type { UserDto } from "@/types/user"
import type { CreateTaskInput, UpdateTaskInput } from "@/schema/task.schema"
import secureApi from "@/api/secure.axios"
import { fetchAllFeatures } from "@/api/feature.api"
import { fetchUsersByTeam } from "@/api/auth.api"
import { toast } from "sonner"
import { extractErrorMessage } from "@/util/error"

type LoadStatus = "idle" | "loading" | "succeeded" | "failed"
type SidebarMode = "create" | "edit" | null

type TaskState = {
    tasks: Task[]
    status: LoadStatus
    selectedTask: Task | null
    selectedStatus: LoadStatus
    error: string | null
    // Sidebar
    sidebarOpen: boolean
    sidebarMode: SidebarMode
    editingTask: Task | null
    // Reference data
    features: Feature[]
    featuresStatus: LoadStatus
    teamUsers: UserDto[]
    teamUsersStatus: LoadStatus
}

const initialState: TaskState = {
    tasks: [],
    status: "idle",
    selectedTask: null,
    selectedStatus: "idle",
    error: null,
    sidebarOpen: false,
    sidebarMode: null,
    editingTask: null,
    features: [],
    featuresStatus: "idle",
    teamUsers: [],
    teamUsersStatus: "idle",
}

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const fetchTaskById = createAsyncThunk<
    Task,
    string,
    { rejectValue: string }
>(
    "task/fetchById",
    async (taskId, { rejectWithValue }) => {
        try {
            const res = await secureApi.get(`/task/${taskId}`)
            return res.data
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err))
        }
    }
)

export const fetchTasksForProject = createAsyncThunk<Task[], string, { rejectValue: string }>(
    "task/fetchForProject",
    async (projectId, { rejectWithValue }) => {
        try {
            const res = await secureApi.get(`/task/project/${projectId}`)
            return res.data
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err))
        }
    }
)

export const fetchFeatures = createAsyncThunk<Feature[]>(
    "task/fetchFeatures",
    async () => fetchAllFeatures()
)

export const fetchTeamUsers = createAsyncThunk<UserDto[], string>(
    "task/fetchTeamUsers",
    async (teamId) => fetchUsersByTeam(teamId)
)

export const createTask = createAsyncThunk<void, CreateTaskInput & { projectId: string }, { rejectValue: string }>(
    "task/create",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            await secureApi.post("/task/create", data)
            dispatch(fetchTasksForProject(data.projectId))
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err))
        }
    }
)

export const updateTask = createAsyncThunk<void, UpdateTaskInput & { projectId: string }, { rejectValue: string }>(
    "task/update",
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const { projectId, ...payload } = data
            await secureApi.put("/task/update", payload)
            dispatch(fetchTasksForProject(projectId))
            dispatch(fetchTaskById(data.id))
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err))
        }
    }
)

export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
    "task/delete",
    async (taskId, { rejectWithValue }) => {
        try {
            await secureApi.delete(`/task/delete/${taskId}`)
            return taskId
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err))
        }
    }
)

export const updateAssignees = createAsyncThunk<void, { taskId: string; assignees: string[] }, { rejectValue: string }>(
    "task/updateAssignees",
    async (data, { rejectWithValue }) => {
        try {
            await secureApi.put("/task-util/add-assignees", data)
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err))
        }
    }
)

export const updateDependencies = createAsyncThunk<void, { taskId: string; dependencies: string[] }, { rejectValue: string }>(
    "task/updateDependencies",
    async (data, { rejectWithValue }) => {
        try {
            await secureApi.put("/task-util/add-dependencies", data)
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err))
        }
    }
)

// ─── Slice ────────────────────────────────────────────────────────────────────
const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        openCreateSidebar(state) {
            state.sidebarOpen = true
            state.sidebarMode = "create"
            state.editingTask = null
        },
        openEditSidebar(state, action: PayloadAction<Task>) {
            state.sidebarOpen = true
            state.sidebarMode = "edit"
            state.editingTask = action.payload
        },
        closeSidebar(state) {
            state.sidebarOpen = false
            state.sidebarMode = null
            state.editingTask = null
        },
        resetTeamUsers(state) {
            state.teamUsers = []
            state.teamUsersStatus = "idle"
        },
    },
    extraReducers: (builder) => {
        builder
            // ── fetchTaskById ───────────────────────────────────────────────
            .addCase(fetchTaskById.pending, (s) => { s.selectedStatus = "loading" })
            .addCase(fetchTaskById.fulfilled, (s, a) => {
                s.selectedStatus = "succeeded"
                s.selectedTask = a.payload
            })
            .addCase(fetchTaskById.rejected, (s) => { s.selectedStatus = "failed" })

            // ── fetchTasksForProject ────────────────────────────────────────
            .addCase(fetchTasksForProject.pending, (s) => {
                s.status = "loading"
                s.error = null
            })
            .addCase(fetchTasksForProject.fulfilled, (s, a) => {
                s.status = "succeeded"
                s.tasks = a.payload

                // Re-sync selected task if still present
                if (s.selectedTask) {
                    const fresh = a.payload.find(t => t.id === s.selectedTask!.id)
                    s.selectedTask = fresh ?? null
                    if (!fresh) s.selectedStatus = "idle"
                }
            })
            .addCase(fetchTasksForProject.rejected, (s, a) => {
                s.status = "failed"
                s.error = a.payload ?? "Failed to load tasks"
            })

            // ── fetchFeatures ───────────────────────────────────────────────
            .addCase(fetchFeatures.pending, (s) => { s.featuresStatus = "loading" })
            .addCase(fetchFeatures.fulfilled, (s, a) => { s.featuresStatus = "succeeded"; s.features = a.payload })
            .addCase(fetchFeatures.rejected, (s) => { s.featuresStatus = "failed" })

            // ── fetchTeamUsers ──────────────────────────────────────────────
            .addCase(fetchTeamUsers.pending, (s) => { s.teamUsersStatus = "loading" })
            .addCase(fetchTeamUsers.fulfilled, (s, a) => { s.teamUsersStatus = "succeeded"; s.teamUsers = a.payload })
            .addCase(fetchTeamUsers.rejected, (s) => { s.teamUsersStatus = "failed" })

            // ── createTask ──────────────────────────────────────────────────
            .addCase(createTask.fulfilled, (s) => {
                s.sidebarOpen = false
                s.sidebarMode = null
                s.editingTask = null
                toast.success("Task created successfully")
            })
            .addCase(createTask.rejected, (_, a) => {
                toast.error(a.payload ?? "Failed to create task")
            })

            // ── updateTask ──────────────────────────────────────────────────
            .addCase(updateTask.fulfilled, (s) => {
                s.sidebarOpen = false
                s.sidebarMode = null
                s.editingTask = null
                toast.success("Task updated successfully")
            })
            .addCase(updateTask.rejected, (_, a) => {
                toast.error(a.payload ?? "Failed to update task")
            })

            // ── deleteTask ──────────────────────────────────────────────────
            .addCase(deleteTask.fulfilled, (s, a) => {
                s.tasks = s.tasks.filter(t => t.id !== a.payload)
                if (s.selectedTask?.id === a.payload) {
                    s.selectedTask = null
                    s.selectedStatus = "idle"
                }
                toast.success("Task deleted")
            })
            .addCase(deleteTask.rejected, (_, a) => {
                toast.error(a.payload ?? "Failed to delete task")
            })

            // ── updateAssignees ─────────────────────────────────────────────
            .addCase(updateAssignees.fulfilled, () => {
                toast.success("Assignees updated")
            })
            .addCase(updateAssignees.rejected, (_, a) => {
                toast.error(a.payload ?? "Failed to update assignees")
            })

            // ── updateDependencies ──────────────────────────────────────────
            .addCase(updateDependencies.fulfilled, () => {
                toast.success("Dependencies updated")
            })
            .addCase(updateDependencies.rejected, (_, a) => {
                toast.error(a.payload ?? "Failed to update dependencies")
            })
    },
})

export const { openCreateSidebar, openEditSidebar, closeSidebar, resetTeamUsers } = taskSlice.actions
export default taskSlice.reducer
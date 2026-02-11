import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth.slice"
import projectReducer from "./project.slice"
import dashboardReducer from "./dashboard.slice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        project: projectReducer,
        dashboard: dashboardReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

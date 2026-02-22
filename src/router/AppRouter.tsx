import { Navigate, Route, Routes } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import AuthLayout from "@/layout/AuthLayout"
import Dashboard from "@/pages/Dashboard"
import ProjectPage from "@/pages/Project"
import Me from "@/pages/Me"

export default function AppRouter() {
    const isAuth = useSelector(
        (s: RootState) => s.auth.isAuthenticated
    )

    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/login"
                element={isAuth ? <Navigate to="/projects" /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuth ? <Navigate to="/projects" /> : <Register />}
            />

            {/* Protected routes */}
            <Route
                element={isAuth ? <AuthLayout /> : <Navigate to="/login" />}
            >
                <Route path="/projects" element={<ProjectPage />} />
                <Route path="/dashboard/:projectId" element={<Dashboard />} />
                <Route path="/me" element={<Me />} />
            </Route>



            {/* Fallback */}
            <Route path="*" element={<Navigate to="/projects" />} />
        </Routes>
    )
}

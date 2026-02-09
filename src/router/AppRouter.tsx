import { Navigate, Route, Routes } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import Login from "../pages/Login"
import Register from "../pages/Register"
import AuthLayout from "../layout/AuthLayout"
import Dashboard from "../pages/Dashboard"


export default function AppRouter() {
    const isAuth = useSelector(
        (s: RootState) => s.auth.isAuthenticated
    )

    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/login"
                element={isAuth ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuth ? <Navigate to="/dashboard" /> : <Register />}
            />

            {/* Protected routes */}
            <Route
                element={isAuth ? <AuthLayout /> : <Navigate to="/login" />}
            >
                <Route path="/dashboard" element={<Dashboard />} />
                {/* future protected routes go here */}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    )
}

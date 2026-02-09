import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { Button } from "../components/ui/button"
import type { AppDispatch, RootState } from "../store"
import { logout } from "../store/auth.slice"

export default function AuthLayout() {
    const dispatch = useDispatch<AppDispatch>()
    const username = useSelector((s: RootState) => s.auth.username)

    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="flex h-14 items-center px-6 justify-between">
                    <nav className="flex gap-6">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                isActive ? "font-semibold" : "text-muted-foreground"
                            }
                        >
                            Dashboard
                        </NavLink>

                        {/* Future links */}
                        <NavLink
                            to="/projects"
                            className="text-muted-foreground"
                        >
                            Projects
                        </NavLink>
                    </nav>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">
                            @{username}
                        </span>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1 p-6 bg-muted">
                <Outlet />
            </main>
        </div>
    )
}

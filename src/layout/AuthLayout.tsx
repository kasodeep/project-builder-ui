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
        <div className="min-h-screen bg-slate-100 flex flex-col">

            {/* Navbar */}
            <header className="h-16 bg-slate-300 border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                    <div className="flex items-center gap-8">
                        <span
                            onClick={() => navigate("/projects")}
                            className="text-lg font-semibold text-slate-800 cursor-pointer"
                        >
                            ProjectBuilder
                        </span>

                        <nav className="flex gap-6 text-sm">
                            <NavLink
                                to="/projects"
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-indigo-600 font-medium"
                                        : "text-slate-500 hover:text-slate-800 transition"
                                }
                            >
                                Projects
                            </NavLink>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">
                            @{username}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="border-slate-300 hover:bg-slate-100"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full py-4">
                <Outlet />
            </main>
        </div>
    )
}

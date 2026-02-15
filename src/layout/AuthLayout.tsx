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
        <div className="min-h-screen bg-slate-200 flex flex-col">

            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/85 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-2 sm:px-3 h-16 flex items-center justify-between">

                    <div className="flex items-center gap-6">
                        <div
                            onClick={() => navigate("/projects")}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105">
                                P
                            </div>
                            <span className="text-lg font-bold tracking-tight text-slate-900">
                                ProjectBuilder
                            </span>
                        </div>

                        <nav className="hidden md:flex items-center gap-1">
                            <NavLink
                                to="/projects"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    }`
                                }
                            >
                                Projects
                            </NavLink>

                            <NavLink
                                to="/me"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    }`
                                }
                            >
                                Me
                            </NavLink>
                        </nav>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-slate-900">
                                @{username}
                            </span>

                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Content Container */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 py-2">
                <Outlet />
            </main>
        </div>
    )
}

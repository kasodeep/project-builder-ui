import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import type { AppDispatch, RootState } from "@/store"
import { logout } from "@/store/auth.slice"
import { Menu, X } from "lucide-react"

export default function AuthLayout() {
    const dispatch = useDispatch<AppDispatch>()
    const username = useSelector((s: RootState) => s.auth.username)
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        dispatch(logout())
        navigate("/login")
    }

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
            ? "bg-slate-100 text-slate-900"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
        }`

    return (
        <div className="min-h-screen bg-slate-200 flex flex-col">

            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/85 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">

                    {/* Left: Logo + desktop nav */}
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

                        {/* Desktop nav links */}
                        <nav className="hidden md:flex items-center gap-1">
                            <NavLink to="/projects" className={navLinkClass}>
                                Projects
                            </NavLink>
                            <NavLink to="/me" className={navLinkClass}>
                                Me
                            </NavLink>
                        </nav>
                    </div>

                    {/* Right: username + logout (desktop) + hamburger (mobile) */}
                    <div className="flex items-center gap-2">
                        {/* Username — always visible */}
                        <span className="text-sm font-semibold text-slate-900 hidden sm:inline">
                            @{username}
                        </span>

                        {/* Logout — hidden on mobile, shown on sm+ */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden sm:flex text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                            Logout
                        </Button>

                        {/* Hamburger — only on mobile */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden h-9 w-9"
                            onClick={() => setMobileMenuOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile dropdown menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-100 bg-white px-3 pb-4 pt-2 flex flex-col gap-1 shadow-sm">
                        {/* Username on mobile */}
                        <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider sm:hidden">
                            @{username}
                        </p>

                        <NavLink
                            to="/projects"
                            className={navLinkClass}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Projects
                        </NavLink>
                        <NavLink
                            to="/me"
                            className={navLinkClass}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Me
                        </NavLink>

                        <div className="mt-2 pt-2 border-t border-slate-100">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setMobileMenuOpen(false)
                                    handleLogout()
                                }}
                                className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                )}
            </header>

            {/* Page content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 py-2">
                <Outlet />
            </main>
        </div>
    )
}
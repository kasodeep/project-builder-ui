import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import type { AppDispatch, RootState } from "../store"
import type { Team } from "../types/team"
import { fetchAllTeams } from "../api/team.api"
import { register } from "../store/auth.slice"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Button } from "../components/ui/button"

export default function Register() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { loading, error } = useSelector((s: RootState) => s.auth)

    const [teams, setTeams] = useState<Team[]>([])
    const [teamsLoading, setTeamsLoading] = useState(true)

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "DEVELOPER",
        teamId: "",
    })

    useEffect(() => {
        fetchAllTeams()
            .then(setTeams)
            .finally(() => setTeamsLoading(false))
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(register(form))
            .unwrap()
            .then(() => navigate("/dashboard"))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <Card className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-xl">

                <CardHeader className="space-y-2 pb-6">
                    <CardTitle className="text-2xl font-semibold text-center text-slate-800">
                        Create account
                    </CardTitle>
                    <p className="text-sm text-slate-500 text-center">
                        Join your team workspace
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-2">
                            <Label className="text-slate-700">Username</Label>
                            <Input
                                required
                                value={form.username}
                                onChange={(e) =>
                                    setForm({ ...form, username: e.target.value })
                                }
                                className="border-slate-300 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Email</Label>
                            <Input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                className="border-slate-300 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Password</Label>
                            <Input
                                type="password"
                                required
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                className="border-slate-300 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Role</Label>
                            <Select
                                value={form.role}
                                onValueChange={(v) =>
                                    setForm({ ...form, role: v })
                                }
                            >
                                <SelectTrigger className="border-slate-300 focus:ring-2 focus:ring-indigo-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DEVELOPER">Developer</SelectItem>
                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Team</Label>
                            <Select
                                disabled={teamsLoading}
                                value={form.teamId}
                                onValueChange={(v) =>
                                    setForm({ ...form, teamId: v })
                                }
                            >
                                <SelectTrigger className="border-slate-300 focus:ring-2 focus:ring-indigo-500">
                                    <SelectValue
                                        placeholder={
                                            teamsLoading ? "Loading teams..." : "Select team"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {teams.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">
                                {error}
                            </p>
                        )}

                        <Button
                            disabled={loading || teamsLoading || !form.teamId}
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                        >
                            {loading ? "Registering..." : "Register"}
                        </Button>

                        <p className="text-sm text-center text-slate-500">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-indigo-600 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}


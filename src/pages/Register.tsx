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
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted px-4">
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Create account</CardTitle>
                    <p className="text-sm text-muted-foreground text-center">
                        Join your team workspace
                    </p>
                </CardHeader>


                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label>Username</Label>
                            <Input
                                required
                                value={form.username}
                                onChange={(e) =>
                                    setForm({ ...form, username: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                required
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Role</Label>
                            <Select
                                value={form.role}
                                onValueChange={(v) =>
                                    setForm({ ...form, role: v })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DEVELOPER">Developer</SelectItem>
                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label>Team</Label>
                            <Select
                                disabled={teamsLoading}
                                value={form.teamId}
                                onValueChange={(v) =>
                                    setForm({ ...form, teamId: v })
                                }
                            >
                                <SelectTrigger>
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
                            <p className="text-sm text-destructive text-center">
                                {error}
                            </p>
                        )}

                        <Button
                            className="w-full"
                            disabled={loading || teamsLoading || !form.teamId}
                        >
                            {loading ? "Registering..." : "Register"}
                        </Button>

                        <p className="text-sm text-center text-muted-foreground">
                            Already registered?{" "}
                            <Link to="/login" className="underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

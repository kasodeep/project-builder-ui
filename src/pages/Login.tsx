import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import type { AppDispatch, RootState } from "../store"
import { login } from "../store/auth.slice"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

export default function Login() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { loading, error } = useSelector((s: RootState) => s.auth)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(login({ username, password }))
            .unwrap()
            .then(() => navigate("/projects"))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <Card className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-xl">

                <CardHeader className="space-y-2 pb-6">
                    <CardTitle className="text-2xl font-semibold text-center text-slate-800">
                        Sign in
                    </CardTitle>
                    <p className="text-sm text-slate-500 text-center">
                        Access your workspace
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-2">
                            <Label className="text-slate-700">Username</Label>
                            <Input
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border-slate-300 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-700">Password</Label>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-slate-300 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">
                                {error}
                            </p>
                        )}

                        <Button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>

                        <p className="text-sm text-center text-slate-500">
                            Don’t have an account?{" "}
                            <Link
                                to="/register"
                                className="text-indigo-600 hover:underline"
                            >
                                Register
                            </Link>
                        </p>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}



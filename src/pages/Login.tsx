import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"

import type { AppDispatch, RootState } from "@/store"
import { login } from "@/store/auth.slice"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { loading, error } = useSelector((s: RootState) => s.auth)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleReset = () => {
        setUsername("");
        setPassword("");
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        dispatch(login({ username, password }))
            .unwrap()
            .then(() => navigate("/projects"))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-300 p-4">
            <Card className="w-full max-w-sm">

                <CardHeader>
                    <CardTitle className="font-bold text-2xl">
                        Sign in
                    </CardTitle>
                    <CardDescription>
                        Access your workspace
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} onReset={handleReset} className="flex flex-col space-y-2">
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">
                                {error}
                            </p>
                        )}

                        <div className="flex items-start space-x-1">
                            <Button
                                disabled={loading}
                                type="submit"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                            <Button type="reset" variant="outline">
                                Reset
                            </Button>
                        </div>


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



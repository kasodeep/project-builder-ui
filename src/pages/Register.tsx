import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import type { AppDispatch, RootState } from "@/store"
import type { Team } from "@/types/team"
import { fetchAllTeams } from "@/api/team.api"
import { register as registerUser } from "@/store/auth.slice"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

// Validation schema using Zod
const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["DEVELOPER", "MANAGER"]),
    teamId: z.string().min(1, "Please select a team"),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { loading, error: serverError } = useSelector((s: RootState) => s.auth)

    const [teams, setTeams] = useState<Team[]>([])
    const [teamsLoading, setTeamsLoading] = useState(true)

    /** * REACT HOOK FORM SETUP
     * register: connects inputs to the library
     * handleSubmit: wrapper that validates before calling your onSubmit
     * setValue: manual update for custom components like Select
     * watch: subscribes to field changes to keep UI in sync
     */
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "DEVELOPER",
            teamId: "",
        }
    })

    const selectedRole = watch("role")
    const selectedTeam = watch("teamId")

    useEffect(() => {
        fetchAllTeams().then(setTeams).finally(() => setTeamsLoading(false))
    }, [])

    const onSubmit = (data: RegisterFormData) => {
        dispatch(registerUser(data))
            .unwrap()
            .then(() => navigate("/dashboard"))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-300 p-4">
            {/* Increased max-width to accommodate side-by-side fields */}
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Create account</CardTitle>
                    <CardDescription>Join your team workspace</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* GRID LAYOUT: 
                            1 column on mobile (grid-cols-1)
                            2 columns on laptop/tablet (md:grid-cols-2)
                        */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                            {/* Username */}
                            <Field>
                                <FieldLabel>Username</FieldLabel>
                                <Input {...register("username")} placeholder="johndoe" />
                                {errors.username && (
                                    <FieldDescription className="text-destructive text-xs">
                                        {errors.username.message}
                                    </FieldDescription>
                                )}
                            </Field>

                            {/* Email */}
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input {...register("email")} type="email" placeholder="john@example.com" />
                                {errors.email && (
                                    <FieldDescription className="text-destructive text-xs">
                                        {errors.email.message}
                                    </FieldDescription>
                                )}
                            </Field>

                            {/* Password */}
                            <Field>
                                <FieldLabel>Password</FieldLabel>
                                <Input {...register("password")} type="password" />
                                {errors.password && (
                                    <FieldDescription className="text-destructive text-xs">
                                        {errors.password.message}
                                    </FieldDescription>
                                )}
                            </Field>

                            {/* Role - Custom Select requires manual setValue */}
                            <Field>
                                <FieldLabel>Role</FieldLabel>
                                <Select
                                    value={selectedRole}
                                    onValueChange={(v) => setValue("role", v as "DEVELOPER" | "MANAGER")}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DEVELOPER">Developer</SelectItem>
                                        <SelectItem value="MANAGER">Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            {/* Team - Full width on small screens, half on large */}
                            <Field className="md:col-span-2">
                                <FieldLabel>Team</FieldLabel>
                                <Select
                                    disabled={teamsLoading}
                                    value={selectedTeam}
                                    onValueChange={(v) => setValue("teamId", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={teamsLoading ? "Loading..." : "Select team"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teams.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teamId && (
                                    <FieldDescription className="text-destructive text-xs">
                                        {errors.teamId.message}
                                    </FieldDescription>
                                )}
                            </Field>
                        </div>

                        {/* Error/Footer area stays full width */}
                        <div className="space-y-4">
                            {serverError && (
                                <div className="p-3 rounded bg-red-50 border border-red-200">
                                    <p className="text-xs text-red-600 font-semibold text-center">{serverError}</p>
                                </div>
                            )}

                            <Button disabled={loading || teamsLoading} type="submit" className="w-full">
                                {loading ? "Registering..." : "Register"}
                            </Button>

                            <p className="text-sm text-center text-slate-500">
                                Already have an account?{" "}
                                <Link to="/login" className="text-indigo-600 hover:underline font-semibold">Sign in</Link>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
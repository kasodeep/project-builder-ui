export type Role = "DEVELOPER" | "MANAGER"

export type UserDto = {
    id: string
    username: string
    role: Role
}
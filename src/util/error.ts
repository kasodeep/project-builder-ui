import axios from "axios"
import type { ErrorResponse } from "@/types/error"

export function extractErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data as ErrorResponse | undefined

        if (data?.error) return data.error
        if (typeof err.message === "string") return err.message
    }

    return "Unexpected error occurred"
}
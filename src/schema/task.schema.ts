import { z } from "zod"
import { Status } from "../types/task"

export const taskBaseSchema = z.object({
    name: z.string().min(1, "Task name is required").max(120, "Name is too long"),
    featureId: z.string().min(1, "Feature is required"),
    priority: z
        .number({ message: "Priority must be a number" })
        .int()
        .min(1, "Minimum priority is 1")
        .max(10, "Maximum priority is 10"),
    status: z.enum(Status),
    start: z.string().min(1, "Start date is required"),
    end: z.string().min(1, "End date is required"),
}).refine(
    (data) => new Date(data.end) >= new Date(data.start),
    {
        message: "End date must be on or after start date",
        path: ["end"],
    }
)

export const createTaskSchema = taskBaseSchema

export const updateTaskSchema = taskBaseSchema.extend({
    id: z.string().min(1),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
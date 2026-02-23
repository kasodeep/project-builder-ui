import { z } from "zod"

export const projectBaseSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    start: z.string().min(1, "Start date is required"),
    end: z.string().min(1, "End date is required")
}).refine(
    (data) => new Date(data.end) >= new Date(data.start),
    {
        message: "End date must be after start date",
        path: ["end"]
    }
)

export const createProjectSchema = projectBaseSchema

export const updateProjectSchema = projectBaseSchema.extend({
    projectId: z.uuid("Invalid project ID"),
    version: z.number()
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

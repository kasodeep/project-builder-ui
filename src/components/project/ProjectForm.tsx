import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Project } from "@/types/project"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    createProjectSchema,
    updateProjectSchema,
    type CreateProjectInput,
    type UpdateProjectInput
} from "@/schema/project.schema"

interface ProjectFormProps {
    initialData?: Project | null
    onSubmit: (data: any) => void
    onCancel: () => void
}

const ProjectForm = ({ initialData, onSubmit, onCancel }: ProjectFormProps) => {
    const isEdit = !!initialData

    // using react-hook-form with zod resolver.
    const form = useForm<CreateProjectInput | UpdateProjectInput>({
        resolver: zodResolver(isEdit ? updateProjectSchema : createProjectSchema),
        defaultValues: isEdit
            ? {
                projectId: initialData!.id,
                version: initialData!.version,
                name: initialData!.name,
                start: initialData!.start,
                end: initialData!.end
            }
            : { name: "", start: "", end: "" }
    })

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form

    useEffect(() => {
        if (initialData) {
            reset({
                projectId: initialData.id,
                version: initialData.version,
                name: initialData.name,
                start: initialData.start,
                end: initialData.end
            })
        }
    }, [initialData, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="p-6 space-y-6">
                {/* project name */}
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        Project Name
                    </Label>
                    <Input
                        {...register("name")}
                        placeholder="Enter project name..."
                    />
                    {errors.name && (
                        <p className="text-xs font-medium text-red-500 mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* start */}
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 gap-2">
                        Start Date
                    </Label>
                    <Input
                        type="date"
                        {...register("start")}
                        onClick={(e) => e.currentTarget.showPicker()}
                    />
                    {errors.start && (
                        <p className="text-xs font-medium text-red-500 mt-1">{errors.start.message}</p>
                    )}
                </div>

                {/* end */}
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        End Date
                    </Label>
                    <Input
                        type="date"
                        {...register("end")}
                        onClick={(e) => e.currentTarget.showPicker()}
                    />
                    {errors.end && (
                        <p className="text-xs font-medium text-red-500 mt-1">{errors.end.message}</p>
                    )}
                </div>
            </div>

            {/* Sticky Footer Actions */}
            <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="hover:bg-red-300"
                >
                    Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : isEdit ? "Save Changes" : "Create Project"}
                </Button>
            </div>
        </form>
    )
}

export default ProjectForm
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


import type { Project } from "../../types/project"

import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { createProjectSchema, updateProjectSchema, type CreateProjectInput, type UpdateProjectInput } from "../../schema/project.schema"

interface Props {
    initialData?: Project | null
    onSubmit: (data: any) => void
    onCancel: () => void
}

const ProjectForm = ({ initialData, onSubmit, onCancel }: Props) => {
    const isEdit = !!initialData

    const form = useForm<
        CreateProjectInput | UpdateProjectInput
    >({
        resolver: zodResolver(
            isEdit ? updateProjectSchema : createProjectSchema
        ),
        defaultValues: isEdit
            ? {
                projectId: initialData!.id,
                name: initialData!.name,
                start: initialData!.start,
                end: initialData!.end
            }
            : {
                name: "",
                start: "",
                end: ""
            }
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = form

    useEffect(() => {
        if (initialData) {
            reset({
                projectId: initialData.id,
                name: initialData.name,
                start: initialData.start,
                end: initialData.end
            })
        }
    }, [initialData, reset])

    return (
        <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    {/* Name */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Project Name
                        </Label>
                        <Input
                            {...register("name")}
                            className="h-10 bg-white border-gray-300"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Start Date
                        </Label>
                        <Input
                            type="date"
                            {...register("start")}
                            className="h-10 bg-white border-gray-300"
                        />
                        {errors.start && (
                            <p className="text-xs text-red-500">
                                {errors.start.message}
                            </p>
                        )}
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            End Date
                        </Label>
                        <Input
                            type="date"
                            {...register("end")}
                            className="h-10 bg-white border-gray-300"
                        />
                        {errors.end && (
                            <p className="text-xs text-red-500">
                                {errors.end.message}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="px-4"
                        >
                            Cancel
                        </Button>

                        <Button type="submit">
                            {isEdit ? "Update Project" : "Create Project"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )

}

export default ProjectForm

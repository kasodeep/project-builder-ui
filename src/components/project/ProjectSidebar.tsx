import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { closeSidebar, createProject, updateProject } from "@/store/project.slice"
import ProjectForm from "./ProjectForm"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { CreateProjectInput, UpdateProjectInput } from "@/schema/project.schema"

const ProjectSidebar = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { sidebarOpen, editingProject } = useSelector((s: RootState) => s.project)

    const handleSubmit = async (data: CreateProjectInput | UpdateProjectInput) => {
        try {
            if (editingProject) {
                // version is injected by ProjectForm via initialData — it must
                // be present in UpdateProjectInput so the backend can do the
                // optimistic lock check.
                await dispatch(updateProject(data as UpdateProjectInput)).unwrap()
            } else {
                await dispatch(createProject(data as CreateProjectInput)).unwrap()
            }
            dispatch(closeSidebar());
        } catch (error) {

        }
    }

    return (
        <Drawer
            open={sidebarOpen}
            onOpenChange={(open) => !open && dispatch(closeSidebar())}
            direction="right"
        >
            <DrawerContent className="h-full w-full max-w-md p-0 flex flex-col shadow-2xl rounded-none">
                {/* Header */}
                <DrawerHeader className="px-6 py-5 border-b flex flex-row items-center justify-between space-y-0">
                    <div>
                        <DrawerTitle className="text-xl font-bold tracking-tight text-slate-900">
                            {editingProject ? "Edit Project" : "New Project"}
                        </DrawerTitle>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            {editingProject
                                ? "Update your project workspace"
                                : "Get started with a new workspace"}
                        </p>
                    </div>

                    <DrawerClose asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                            <X className="h-5 w-5 text-slate-400" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <ProjectForm
                        initialData={editingProject || undefined}
                        onSubmit={handleSubmit}
                        onCancel={() => dispatch(closeSidebar())}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default ProjectSidebar
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../../store"
import {
    closeSidebar,
    createProject,
    updateProject,
} from "../../store/project.slice"

import ProjectForm from "./ProjectForm"

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
} from "../../components/ui/drawer"

import { Button } from "../ui/button"
import { X } from "lucide-react"

const ProjectSidebar = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { sidebarOpen, editingProject } = useSelector(
        (s: RootState) => s.project
    )

    const handleSubmit = async (data: any) => {
        try {
            if (editingProject) {
                await dispatch(updateProject(data)).unwrap()
            } else {
                await dispatch(createProject(data)).unwrap()
            }

            dispatch(closeSidebar())
        } catch {
            // error handled by centralized toast middleware
        }
    }

    return (
        <Drawer
            open={sidebarOpen}
            onOpenChange={(open) => {
                if (!open) dispatch(closeSidebar())
            }}
            direction="right"
        >
            <DrawerContent
                className="h-dvh w-full max-w-md p-0 flex flex-col bg-linear-to-b from-gray-400/90 to-gray-300/90
                            backdrop-blur-xl border-l border-white/20 shadow-2xl">

                {/* Header */}
                <DrawerHeader className="px-6 py-5 border-b flex flex-row items-end justify-between">
                    <DrawerTitle className="text-lg font-semibold tracking-tight">
                        {editingProject ? "Edit Project" : "Create Project"}
                    </DrawerTitle>

                    <DrawerClose asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => dispatch(closeSidebar())}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6">
                    <ProjectForm
                        initialData={editingProject || undefined}
                        onSubmit={handleSubmit}
                        onCancel={() => dispatch(closeSidebar())}
                    />
                </div>

                {/* Footer (optional future use) */}
                <DrawerFooter className="px-6 py-4 border-t" />
            </DrawerContent>
        </Drawer>
    )

}

export default ProjectSidebar

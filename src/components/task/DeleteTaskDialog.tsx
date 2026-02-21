import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import type { Task } from "../../types/task";

function DeleteTaskDialog({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription> Are you sure you want to delete <strong>{task.name}</strong>? This action cannot be undone and may affect dependent tasks. </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel size="default" variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onDelete(task.id)}
                        className="bg-red-600 hover:bg-red-700"
                        size="default" variant="medium">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    )
}

export default DeleteTaskDialog
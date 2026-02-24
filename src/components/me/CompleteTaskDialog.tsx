import { CheckCircle2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task";

function CompleteTaskDialog({ task, onComplete }: { task: Task; onComplete: (id: string) => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Complete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to mark <strong>{task.name}</strong> as completed? This will
                        notify your team and may unlock dependent tasks.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel size="default" variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onComplete(task.id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                        size="default"
                        variant="default"
                    >
                        Mark as Completed
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default CompleteTaskDialog;
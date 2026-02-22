import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ProjectCardSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-70 w-full flex flex-col p-6 space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-8 w-3/4" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                    <div className="flex justify-between pt-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default ProjectCardSkeleton
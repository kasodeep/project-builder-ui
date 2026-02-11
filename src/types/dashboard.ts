export interface ProjectAnalytics {
    totalTasks: number
    completedTasks: number
    blockedTasks: number
    completionRatio: number
    statusDistribution: Record<string, number>
}

export interface FeatureAnalytics {
    featureId: string
    featureName: string
    totalTasks: number
    completedTasks: number
    blockedTasks: number
    completionRatio: number
    atRisk: boolean
}

export interface UserDependencyRisk {
    userId: string
    username: string
    blockingTasks: number
    blockedUsers: number
    riskScore: number
}

export interface DashboardAnalytics {
    project: ProjectAnalytics
    features: FeatureAnalytics[]
    users: UserDependencyRisk[]
}

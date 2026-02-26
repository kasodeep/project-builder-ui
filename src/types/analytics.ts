export interface ProjectHealthDto {
    healthGrade: "A" | "B" | "C" | "D" | "F"
    overdueTasks: number
    blockedTasks: number
    longRunningTasks: number
    riskLevel: "GREEN" | "AMBER" | "RED"
}

export interface ProjectFlowDto {
    wipCount: number
    throughput7d: number
    throughput30d: number
    avgCycleTime: number
}

export interface DependencyRiskDto {
    totalDependencies: number
    blockedDependencyCount: number
    criticalPathLength: number
    dependencyDensity: number
    riskScore: number
}

export interface TeamCapacityDto {
    activeProjects: number
    activeTasks: number
    avgTasksPerUser: number
    overloadedUsers: number
    avgCompletionTimeDays: number
    burnoutRiskScore: number
}

export interface DashboardAnalyticsDto {
    health: ProjectHealthDto
    flow: ProjectFlowDto
    dependency: DependencyRiskDto
    team: TeamCapacityDto
}
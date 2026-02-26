import secureApi from "@/api/secure.axios"
import type { DashboardAnalyticsDto } from "@/types/analytics"

export const fetchProjectAnalytics = async (projectId: string): Promise<DashboardAnalyticsDto> => {
    const { data } = await secureApi.get<DashboardAnalyticsDto>(`/analytics/${projectId}`)
    return data
}
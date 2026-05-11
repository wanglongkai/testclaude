import request from '../request'
import type { ApiResponse } from '@/types'

export interface DashboardStats {
  knowledgeCount: number
  rankingCount: number
  memberCount: number
  logCount: number
}

export function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return request.get('/dashboard/stats')
}

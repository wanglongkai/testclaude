import request from '../request'
import type { ApiResponse, PageResult } from '@/types'

export interface KnowledgeResource {
  id: string
  title: string
  type: 'document' | 'video' | 'image' | 'audio'
  category: string
  author: string
  status: 'published' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface KnowledgeSearchParams {
  page: number
  pageSize: number
  keyword?: string
  type?: string
  status?: string
}

export function getResources(params: KnowledgeSearchParams): Promise<ApiResponse<PageResult<KnowledgeResource>>> {
  return request.get('/knowledge/resources', { params })
}

export function createResource(data: Partial<KnowledgeResource>): Promise<ApiResponse<KnowledgeResource>> {
  return request.post('/knowledge/resources', data)
}

export function updateResource(id: string, data: Partial<KnowledgeResource>): Promise<ApiResponse<KnowledgeResource>> {
  return request.put(`/knowledge/resources/${id}`, data)
}

export function deleteResource(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/knowledge/resources/${id}`)
}

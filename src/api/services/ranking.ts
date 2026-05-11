import request from '../request'
import type { ApiResponse, PageResult } from '@/types'

export interface RankingCategory {
  id: string
  name: string
  order: number
  status: 'active' | 'inactive'
  description?: string
  createdAt: string
}

export interface Submission {
  id: string
  title: string
  author: string
  categoryId: string
  categoryName: string
  status: 'pending' | 'approved' | 'rejected'
  voteCount: number
  submittedAt: string
}

export interface StyleContent {
  id: string
  userId: string
  userName: string
  content: string
  imageUrl?: string
  status: 'published' | 'draft'
  updatedAt: string
}

export function getCategories(params: {
  page: number
  pageSize: number
}): Promise<ApiResponse<PageResult<RankingCategory>>> {
  return request.get('/ranking/categories', { params })
}

export function createCategory(data: Partial<RankingCategory>): Promise<ApiResponse<RankingCategory>> {
  return request.post('/ranking/categories', data)
}

export function updateCategory(id: string, data: Partial<RankingCategory>): Promise<ApiResponse<RankingCategory>> {
  return request.put(`/ranking/categories/${id}`, data)
}

export function deleteCategory(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/ranking/categories/${id}`)
}

export function getSubmissions(params: {
  page: number
  pageSize: number
  keyword?: string
  status?: string
}): Promise<ApiResponse<PageResult<Submission>>> {
  return request.get('/ranking/submissions', { params })
}

export function approveSubmission(id: string): Promise<ApiResponse<Submission>> {
  return request.put(`/ranking/submissions/${id}/approve`)
}

export function rejectSubmission(id: string): Promise<ApiResponse<Submission>> {
  return request.put(`/ranking/submissions/${id}/reject`)
}

export function getStyleContents(params: {
  page: number
  pageSize: number
}): Promise<ApiResponse<PageResult<StyleContent>>> {
  return request.get('/ranking/style', { params })
}

export function updateStyleContent(id: string, data: Partial<StyleContent>): Promise<ApiResponse<StyleContent>> {
  return request.put(`/ranking/style/${id}`, data)
}

import request from '../request'
import type { ApiResponse, PageResult } from '@/types'

export interface PartyGroup {
  id: string
  name: string
  parentId: string | null
  leaderName: string
  memberCount: number
  order: number
  createdAt: string
}

export interface PartyMember {
  id: string
  name: string
  groupId: string
  groupName: string
  position: string
  joinDate: string
  phone: string
  status: 'active' | 'transferred' | 'inactive'
}

export interface TransferRecord {
  id: string
  memberId: string
  memberName: string
  fromGroupId: string
  fromGroupName: string
  toGroupId: string
  toGroupName: string
  reason: string
  transferDate: string
}

export function getGroupTree(): Promise<ApiResponse<PartyGroup[]>> {
  return request.get('/party/groups/tree')
}

export function createGroup(data: Partial<PartyGroup>): Promise<ApiResponse<PartyGroup>> {
  return request.post('/party/groups', data)
}

export function updateGroup(id: string, data: Partial<PartyGroup>): Promise<ApiResponse<PartyGroup>> {
  return request.put(`/party/groups/${id}`, data)
}

export function deleteGroup(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/party/groups/${id}`)
}

export function getMembers(params: {
  page: number
  pageSize: number
  keyword?: string
  groupId?: string
  status?: string
}): Promise<ApiResponse<PageResult<PartyMember>>> {
  return request.get('/party/members', { params })
}

export function getAllMembers(): Promise<ApiResponse<PartyMember[]>> {
  return request.get('/party/members/all')
}

export function createMember(data: Partial<PartyMember>): Promise<ApiResponse<PartyMember>> {
  return request.post('/party/members', data)
}

export function updateMember(id: string, data: Partial<PartyMember>): Promise<ApiResponse<PartyMember>> {
  return request.put(`/party/members/${id}`, data)
}

export function deleteMember(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/party/members/${id}`)
}

export function getTransfers(params: {
  page: number
  pageSize: number
  keyword?: string
}): Promise<ApiResponse<PageResult<TransferRecord>>> {
  return request.get('/party/transfers', { params })
}

export function transferMember(data: {
  memberId: string
  toGroupId: string
  reason: string
}): Promise<ApiResponse<TransferRecord>> {
  return request.post('/party/transfers', data)
}

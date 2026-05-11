import request from '../request'
import type { ApiResponse, PageResult } from '@/types'

export interface SysUser {
  id: string
  username: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'disabled'
  createdAt: string
}

export interface NotificationConfig {
  id: string
  type: 'email' | 'sms' | 'webhook'
  event: string
  enabled: boolean
  recipients: string
  updatedAt: string
}

export interface BackupRecord {
  id: string
  fileName: string
  size: string
  status: 'success' | 'failed' | 'running'
  createdAt: string
}

export interface SysLog {
  id: string
  operator: string
  action: string
  module: string
  detail: string
  ip: string
  createdAt: string
}

export interface DictionaryItem {
  id: string
  type: string
  label: string
  value: string
  order: number
  status: 'enabled' | 'disabled'
}

export interface SystemParam {
  id: string
  key: string
  value: string
  description: string
  updatedAt: string
}

export function getUsers(params: { page: number; pageSize: number }): Promise<ApiResponse<PageResult<SysUser>>> {
  return request.get('/system/users', { params })
}
export function createUser(data: Partial<SysUser>): Promise<ApiResponse<SysUser>> {
  return request.post('/system/users', data)
}
export function updateUser(id: string, data: Partial<SysUser>): Promise<ApiResponse<SysUser>> {
  return request.put(`/system/users/${id}`, data)
}
export function deleteUser(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/system/users/${id}`)
}

export function getNotificationConfigs(params: {
  page: number
  pageSize: number
}): Promise<ApiResponse<PageResult<NotificationConfig>>> {
  return request.get('/system/notifications', { params })
}
export function updateNotificationConfig(
  id: string,
  data: Partial<NotificationConfig>,
): Promise<ApiResponse<NotificationConfig>> {
  return request.put(`/system/notifications/${id}`, data)
}

export function getBackupRecords(params: {
  page: number
  pageSize: number
}): Promise<ApiResponse<PageResult<BackupRecord>>> {
  return request.get('/system/backups', { params })
}
export function createBackup(): Promise<ApiResponse<BackupRecord>> {
  return request.post('/system/backups')
}
export function restoreBackup(id: string): Promise<ApiResponse<null>> {
  return request.post(`/system/backups/${id}/restore`)
}

export function getLogs(params: {
  page: number
  pageSize: number
  keyword?: string
  module?: string
}): Promise<ApiResponse<PageResult<SysLog>>> {
  return request.get('/system/logs', { params })
}

export function getDictionaryItems(params: {
  page: number
  pageSize: number
  type?: string
}): Promise<ApiResponse<PageResult<DictionaryItem>>> {
  return request.get('/system/dictionary', { params })
}
export function createDictionaryItem(data: Partial<DictionaryItem>): Promise<ApiResponse<DictionaryItem>> {
  return request.post('/system/dictionary', data)
}
export function updateDictionaryItem(id: string, data: Partial<DictionaryItem>): Promise<ApiResponse<DictionaryItem>> {
  return request.put(`/system/dictionary/${id}`, data)
}
export function deleteDictionaryItem(id: string): Promise<ApiResponse<null>> {
  return request.delete(`/system/dictionary/${id}`)
}

export function getSystemParams(): Promise<ApiResponse<SystemParam[]>> {
  return request.get('/system/params')
}
export function updateSystemParam(id: string, data: Partial<SystemParam>): Promise<ApiResponse<SystemParam>> {
  return request.put(`/system/params/${id}`, data)
}

import type { ReactNode } from 'react'

// 通用分页请求
export interface PageParams {
  page: number
  pageSize: number
}

// 通用分页响应
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 通用 API 响应
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 用户信息
export interface UserInfo {
  id: string
  username: string
  name: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
}

// 登录请求/响应
export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: UserInfo
}

// 侧边栏菜单项
export interface MenuItem {
  key: string
  label: string
  icon?: ReactNode
  children?: MenuItem[]
}

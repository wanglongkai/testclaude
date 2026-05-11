import request from '../request'
import type { ApiResponse, LoginParams, LoginResult } from '@/types'

export function login(params: LoginParams): Promise<ApiResponse<LoginResult>> {
  return request.post('/auth/login', params)
}

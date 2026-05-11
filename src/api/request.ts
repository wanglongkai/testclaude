import axios from 'axios'
import { message } from 'antd'
import { getToken, removeToken, removeUserInfo } from '@/utils'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// 请求拦截器: 自动注入 token
request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器: 统一错误处理
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== 0 && data.code !== 200) {
      message.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
    return data
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    if (error.response?.status === 401) {
      removeToken()
      removeUserInfo()
      window.location.href = '/login'
      message.error('登录已过期，请重新登录')
      return Promise.reject(error)
    }
    message.error(error.message || '网络错误')
    return Promise.reject(error)
  },
)

export default request

import { create } from 'zustand'
import { setToken, removeToken, setUserInfo, removeUserInfo, getToken, getUserInfo } from '@/utils'
import type { UserInfo, LoginParams } from '@/types'
import { login as loginApi } from '@/api/services/auth'

interface AuthState {
  token: string | null
  userInfo: UserInfo | null
  login: (params: LoginParams) => Promise<void>
  logout: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getToken(),
  userInfo: getUserInfo() as UserInfo | null,

  login: async (params: LoginParams) => {
    const res = await loginApi(params)
    const { token, user } = res.data
    setToken(token)
    setUserInfo(user)
    set({ token, userInfo: user })
  },

  logout: () => {
    removeToken()
    removeUserInfo()
    set({ token: null, userInfo: null })
  },

  loadFromStorage: () => {
    set({
      token: getToken(),
      userInfo: getUserInfo() as UserInfo | null,
    })
  },
}))

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function setToken(token: string): void {
  localStorage.setItem('token', token)
}

export function removeToken(): void {
  localStorage.removeItem('token')
}

export function getUserInfo(): Record<string, unknown> | null {
  const raw = localStorage.getItem('userInfo')
  return raw ? JSON.parse(raw) : null
}

export function setUserInfo(user: object): void {
  localStorage.setItem('userInfo', JSON.stringify(user))
}

export function removeUserInfo(): void {
  localStorage.removeItem('userInfo')
}

import { http, HttpResponse, delay } from 'msw'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as { username: string; password: string }
    if (body.username && body.password) {
      return HttpResponse.json({
        code: 200,
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            username: body.username,
            name: '管理员',
            avatar: '',
            role: 'admin' as const,
          },
        },
        message: '登录成功',
      })
    }
    return HttpResponse.json({ code: 401, data: null, message: '用户名或密码错误' }, { status: 401 })
  }),
]

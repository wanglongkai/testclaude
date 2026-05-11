import { http, HttpResponse, delay } from 'msw'

export const dashboardHandlers = [
  http.get('/api/dashboard/stats', async () => {
    await delay(300)
    return HttpResponse.json({
      code: 200,
      data: {
        knowledgeCount: 1248,
        rankingCount: 356,
        memberCount: 89,
        logCount: 2560,
      },
      message: 'ok',
    })
  }),
]

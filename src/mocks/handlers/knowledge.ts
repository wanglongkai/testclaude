import { http, HttpResponse, delay } from 'msw'

let idCounter = 10

const resources = [
  {
    id: '1',
    title: '习近平新时代中国特色社会主义思想学习纲要',
    type: 'document' as const,
    category: '理论文献',
    author: '张三',
    status: 'published' as const,
    createdAt: '2026-01-15',
    updatedAt: '2026-04-20',
  },
  {
    id: '2',
    title: '党史教育专题片：光辉历程',
    type: 'video' as const,
    category: '视频资源',
    author: '李四',
    status: 'published' as const,
    createdAt: '2026-02-10',
    updatedAt: '2026-03-05',
  },
  {
    id: '3',
    title: '党建工作流程图解',
    type: 'image' as const,
    category: '图解资源',
    author: '王五',
    status: 'published' as const,
    createdAt: '2026-03-22',
    updatedAt: '2026-03-22',
  },
  {
    id: '4',
    title: '基层党建经验交流录音',
    type: 'audio' as const,
    category: '音频资源',
    author: '赵六',
    status: 'draft' as const,
    createdAt: '2026-04-01',
    updatedAt: '2026-04-15',
  },
  {
    id: '5',
    title: '三会一课制度详解',
    type: 'document' as const,
    category: '制度文件',
    author: '张三',
    status: 'published' as const,
    createdAt: '2026-04-18',
    updatedAt: '2026-05-01',
  },
  {
    id: '6',
    title: '优秀党员事迹纪录片',
    type: 'video' as const,
    category: '视频资源',
    author: '李四',
    status: 'archived' as const,
    createdAt: '2025-12-01',
    updatedAt: '2026-01-10',
  },
  {
    id: '7',
    title: '党员发展流程图',
    type: 'image' as const,
    category: '图解资源',
    author: '王五',
    status: 'published' as const,
    createdAt: '2026-05-02',
    updatedAt: '2026-05-02',
  },
  {
    id: '8',
    title: '党的二十大精神解读',
    type: 'document' as const,
    category: '理论文献',
    author: '张三',
    status: 'published' as const,
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
  },
  {
    id: '9',
    title: '主题党日活动策划方案',
    type: 'document' as const,
    category: '活动方案',
    author: '赵六',
    status: 'draft' as const,
    createdAt: '2026-04-25',
    updatedAt: '2026-05-05',
  },
]

export const knowledgeHandlers = [
  http.get('/api/knowledge/resources', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = +(url.searchParams.get('page') || 1)
    const pageSize = +(url.searchParams.get('pageSize') || 10)
    const keyword = url.searchParams.get('keyword') || ''
    const type = url.searchParams.get('type') || ''
    const status = url.searchParams.get('status') || ''

    let filtered = resources
    if (keyword) filtered = filtered.filter((r) => r.title.includes(keyword))
    if (type) filtered = filtered.filter((r) => r.type === type)
    if (status) filtered = filtered.filter((r) => r.status === status)

    const start = (page - 1) * pageSize
    return HttpResponse.json({
      code: 200,
      data: { list: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize },
      message: 'ok',
    })
  }),

  http.post('/api/knowledge/resources', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const newItem = {
      ...body,
      id: String(++idCounter),
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    resources.unshift(newItem as (typeof resources)[0])
    return HttpResponse.json({ code: 200, data: newItem, message: '创建成功' })
  }),

  http.put('/api/knowledge/resources/:id', async ({ request, params }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const idx = resources.findIndex((r) => r.id === params.id)
    if (idx !== -1) {
      resources[idx] = {
        ...resources[idx],
        ...body,
        updatedAt: new Date().toISOString().slice(0, 10),
      } as (typeof resources)[0]
      return HttpResponse.json({ code: 200, data: resources[idx], message: '更新成功' })
    }
    return HttpResponse.json({ code: 404, data: null, message: '资源不存在' }, { status: 404 })
  }),

  http.delete('/api/knowledge/resources/:id', async ({ params }) => {
    await delay(200)
    const idx = resources.findIndex((r) => r.id === params.id)
    if (idx !== -1) {
      resources.splice(idx, 1)
    }
    return HttpResponse.json({ code: 200, data: null, message: '删除成功' })
  }),
]

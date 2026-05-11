import { http, HttpResponse, delay } from 'msw'

let catIdCounter = 10

const categories = [
  {
    id: '1',
    name: '理论学习',
    order: 1,
    status: 'active' as const,
    description: '理论学习类作品',
    createdAt: '2026-01-10',
  },
  {
    id: '2',
    name: '党建创新',
    order: 2,
    status: 'active' as const,
    description: '党建工作创新案例',
    createdAt: '2026-01-15',
  },
  {
    id: '3',
    name: '志愿服务',
    order: 3,
    status: 'active' as const,
    description: '志愿服务活动记录',
    createdAt: '2026-02-01',
  },
  {
    id: '4',
    name: '文化风采',
    order: 4,
    status: 'inactive' as const,
    description: '文化活动展示',
    createdAt: '2026-02-20',
  },
]

const submissions = [
  {
    id: '1',
    title: '社区网格化党建创新实践',
    author: '张三',
    categoryId: '2',
    categoryName: '党建创新',
    status: 'pending' as const,
    voteCount: 0,
    submittedAt: '2026-04-15',
  },
  {
    id: '2',
    title: '青年党员志愿服务队纪实',
    author: '李四',
    categoryId: '3',
    categoryName: '志愿服务',
    status: 'approved' as const,
    voteCount: 128,
    submittedAt: '2026-04-10',
  },
  {
    id: '3',
    title: '学习强国学习心得',
    author: '王五',
    categoryId: '1',
    categoryName: '理论学习',
    status: 'approved' as const,
    voteCount: 256,
    submittedAt: '2026-03-28',
  },
  {
    id: '4',
    title: '红色诗词书法作品集',
    author: '赵六',
    categoryId: '4',
    categoryName: '文化风采',
    status: 'rejected' as const,
    voteCount: 0,
    submittedAt: '2026-04-20',
  },
  {
    id: '5',
    title: '基层党支部标准化建设经验',
    author: '孙七',
    categoryId: '2',
    categoryName: '党建创新',
    status: 'pending' as const,
    voteCount: 0,
    submittedAt: '2026-05-01',
  },
]

const styleContents = [
  {
    id: '1',
    userId: '1',
    userName: '张三',
    content: '扎根基层十余年，用实际行动践行党员初心使命...',
    status: 'published' as const,
    updatedAt: '2026-04-20',
  },
  {
    id: '2',
    userId: '2',
    userName: '李四',
    content: '带领青年志愿服务队开展帮扶活动百余次...',
    status: 'published' as const,
    updatedAt: '2026-04-18',
  },
  {
    id: '3',
    userId: '3',
    userName: '王五',
    content: '坚持理论学习，获评学习强国年度标兵...',
    status: 'draft' as const,
    updatedAt: '2026-05-02',
  },
]

export const rankingHandlers = [
  // Categories CRUD
  http.get('/api/ranking/categories', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = +(url.searchParams.get('page') || 1)
    const pageSize = +(url.searchParams.get('pageSize') || 10)
    const start = (page - 1) * pageSize
    return HttpResponse.json({
      code: 200,
      data: { list: categories.slice(start, start + pageSize), total: categories.length, page, pageSize },
      message: 'ok',
    })
  }),

  http.post('/api/ranking/categories', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const newItem = {
      ...body,
      id: String(++catIdCounter),
      createdAt: new Date().toISOString().slice(0, 10),
    } as (typeof categories)[0]
    categories.unshift(newItem)
    return HttpResponse.json({ code: 200, data: newItem, message: '创建成功' })
  }),

  http.put('/api/ranking/categories/:id', async ({ request, params }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const idx = categories.findIndex((c) => c.id === params.id)
    if (idx !== -1) {
      categories[idx] = { ...categories[idx], ...body } as (typeof categories)[0]
      return HttpResponse.json({ code: 200, data: categories[idx], message: '更新成功' })
    }
    return HttpResponse.json({ code: 404, data: null, message: '不存在' }, { status: 404 })
  }),

  http.delete('/api/ranking/categories/:id', async ({ params }) => {
    await delay(200)
    const idx = categories.findIndex((c) => c.id === params.id)
    if (idx !== -1) categories.splice(idx, 1)
    return HttpResponse.json({ code: 200, data: null, message: '删除成功' })
  }),

  // Submissions
  http.get('/api/ranking/submissions', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = +(url.searchParams.get('page') || 1)
    const pageSize = +(url.searchParams.get('pageSize') || 10)
    const status = url.searchParams.get('status') || ''
    const keyword = url.searchParams.get('keyword') || ''
    let filtered = submissions
    if (status) filtered = filtered.filter((s) => s.status === status)
    if (keyword) filtered = filtered.filter((s) => s.title.includes(keyword) || s.author.includes(keyword))
    const start = (page - 1) * pageSize
    return HttpResponse.json({
      code: 200,
      data: { list: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize },
      message: 'ok',
    })
  }),

  http.put('/api/ranking/submissions/:id/approve', async ({ params }) => {
    await delay(200)
    const item = submissions.find((s) => s.id === params.id)
    if (item) item.status = 'approved'
    return HttpResponse.json({ code: 200, data: item, message: '已通过' })
  }),

  http.put('/api/ranking/submissions/:id/reject', async ({ params }) => {
    await delay(200)
    const item = submissions.find((s) => s.id === params.id)
    if (item) item.status = 'rejected'
    return HttpResponse.json({ code: 200, data: item, message: '已驳回' })
  }),

  // Style content
  http.get('/api/ranking/style', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = +(url.searchParams.get('page') || 1)
    const pageSize = +(url.searchParams.get('pageSize') || 10)
    const start = (page - 1) * pageSize
    return HttpResponse.json({
      code: 200,
      data: { list: styleContents.slice(start, start + pageSize), total: styleContents.length, page, pageSize },
      message: 'ok',
    })
  }),

  http.put('/api/ranking/style/:id', async ({ request, params }) => {
    await delay(300)
    const body = (await request.json()) as Record<string, unknown>
    const item = styleContents.find((s) => s.id === params.id)
    if (item) {
      Object.assign(item, body, { updatedAt: new Date().toISOString().slice(0, 10) })
      return HttpResponse.json({ code: 200, data: item, message: '更新成功' })
    }
    return HttpResponse.json({ code: 404, data: null, message: '不存在' }, { status: 404 })
  }),
]
